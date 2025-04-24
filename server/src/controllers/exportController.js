import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dbService from '../services/dbService.js';
import { convertToCsv } from '../utils/exportHelpers.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPORTS_DIR = join(__dirname, '../exports');
if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

const shareableExports = new Map();

export async function exportToCsv(req, res, next) {
    try {
        const { sqlQuery } = req.body;
        if (!sqlQuery) {
            return res.status(400).json({ error: 'Missing required parameter: sqlQuery' });
        }

        const result = await dbService.executeQuery(sqlQuery);
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'No data to export',
                message: 'The query returned no results'
            });
        }

        const csvContent = convertToCsv(result.rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
        res.send(csvContent);
    } catch (error) {
        next(error);
    }
}

export async function exportToJson(req, res, next) {
    try {
        const { sqlQuery } = req.body;
        if (!sqlQuery) {
            return res.status(400).json({ error: 'Missing required parameter: sqlQuery' });
        }

        const result = await dbService.executeQuery(sqlQuery);
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'No data to export',
                message: 'The query returned no results'
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function createShareableLink(req, res, next) {
    try {
        const { sqlQuery, format = 'json' } = req.body;
        if (!sqlQuery) {
            return res.status(400).json({ error: 'Missing required parameter: sqlQuery' });
        }

        const result = await dbService.executeQuery(sqlQuery);
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'No data to share',
                message: 'The query returned no results'
            });
        }

        const shareId = uuidv4();
        const exportData = {
            sqlQuery,
            format,
            data: result.rows,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        shareableExports.set(shareId, exportData);

        const baseUrl = process.env.BASE_URL || `https://mydatatalk.onrender.com/:${process.env.PORT || 5000}`;
        const shareUrl = `${baseUrl}/api/export/shared/${shareId}`;

        res.json({ shareId, shareUrl, expiresAt: exportData.expiresAt });
    } catch (error) {
        next(error);
    }
}

export async function getSharedExport(req, res, next) {
    try {
        const { shareId } = req.params;
        if (!shareableExports.has(shareId)) {
            return res.status(404).json({
                error: 'Shared export not found',
                message: 'The link may have expired or been removed'
            });
        }

        const exportData = shareableExports.get(shareId);
        if (new Date() > exportData.expiresAt) {
            shareableExports.delete(shareId);
            return res.status(410).json({
                error: 'Shared export expired',
                message: 'This shared export has expired'
            });
        }

        if (exportData.format === 'csv') {
            const csvContent = convertToCsv(exportData.data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="shared_export.csv"');
            return res.send(csvContent);
        }

        // default to JSON
        res.json(exportData.data);
    } catch (error) {
        next(error);
    }
}
