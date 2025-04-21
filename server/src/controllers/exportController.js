const dbService = require('../services/dbService');
const exportHelpers = require('../utils/exportHelpers');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const EXPORTS_DIR = path.join(__dirname, '../exports');
if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

const shareableExports = new Map();


async function exportToCsv(req, res, next) {
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

        // Generate CSV content
        const csvContent = exportHelpers.convertToCsv(result.rows);

        // For direct download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
        res.send(csvContent);
    } catch (error) {
        next(error);
    }
}


async function exportToJson(req, res, next) {
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

        // For direct download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

async function createShareableLink(req, res, next) {
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

        // Generate unique share ID
        const shareId = uuidv4();

        // Store export data
        const exportData = {
            sqlQuery,
            format,
            data: result.rows,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        };

        shareableExports.set(shareId, exportData);

        // Create shareable URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const shareUrl = `${baseUrl}/api/export/shared/${shareId}`;

        res.json({
            shareId,
            shareUrl,
            expiresAt: exportData.expiresAt
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Downloads a shared export
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getSharedExport(req, res, next) {
    try {
        const { shareId } = req.params;

        if (!shareableExports.has(shareId)) {
            return res.status(404).json({
                error: 'Shared export not found',
                message: 'The link may have expired or been removed'
            });
        }

        const exportData = shareableExports.get(shareId);

        // Check if expired
        if (new Date() > exportData.expiresAt) {
            shareableExports.delete(shareId);
            return res.status(410).json({
                error: 'Shared export expired',
                message: 'This shared export has expired'
            });
        }

        // Return data based on format
        switch (exportData.format) {
            case 'csv':
                const csvContent = exportHelpers.convertToCsv(exportData.data);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="shared_export.csv"');
                return res.send(csvContent);
            case 'json':
            default:
                return res.json(exportData.data);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    exportToCsv,
    exportToJson,
    createShareableLink,
    getSharedExport
};