import express from 'express';
import {
    exportToCsv,
    exportToJson,
    createShareableLink,
    getSharedExport
} from '../controllers/exportController.js';

const router = express.Router();

router.post('/csv', exportToCsv);
router.post('/json', exportToJson);
router.post('/share', createShareableLink);
router.get('/shared/:shareId', getSharedExport);

router.get('/formats', (req, res) => {
    res.json({
        available_formats: [
            {
                id: 'csv',
                name: 'CSV (Comma Separated Values)',
                mime_type: 'text/csv',
                extension: '.csv',
                description: 'Simple text format compatible with most spreadsheet applications'
            },
            {
                id: 'json',
                name: 'JSON (JavaScript Object Notation)',
                mime_type: 'application/json',
                extension: '.json',
                description: 'Standard data interchange format for web applications'
            },
        ]
    });
});

export default router;
