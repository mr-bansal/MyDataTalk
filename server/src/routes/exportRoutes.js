const express = require('express');
const exportController = require('../controllers/exportController.js');
const router = express.Router();

router.post('/csv', exportController.exportToCsv);

router.post('/json', exportController.exportToJson);

router.post('/share', exportController.createShareableLink);

router.get('/shared/:shareId', exportController.getSharedExport);

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

module.exports = router;