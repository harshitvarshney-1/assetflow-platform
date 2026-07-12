import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Asset } from '../types';

export const exportToCSV = (assets: Asset[], fileName = 'assets_export.csv') => {
  const headers = [
    'Asset Tag', 'Asset Name', 'Category', 'Department', 'Current Holder',
    'Serial Number', 'Purchase Date', 'Purchase Cost', 'Manufacturer', 'Model Number',
    'Condition', 'Location', 'Status'
  ];

  const rows = assets.map(a => [
    a.assetTag, a.assetName, a.category, a.department, a.currentHolder || 'None',
    a.serialNumber, a.purchaseDate, a.purchaseCost, a.manufacturer || '', a.modelNumber || '',
    a.condition, a.location || '', a.status
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

export const exportToExcel = async (assets: Asset[], fileName = 'assets_export.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Assets');

  worksheet.columns = [
    { header: 'Asset Tag', key: 'assetTag', width: 18 },
    { header: 'Asset Name', key: 'assetName', width: 25 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Department', key: 'department', width: 18 },
    { header: 'Current Holder', key: 'currentHolder', width: 20 },
    { header: 'Serial Number', key: 'serialNumber', width: 20 },
    { header: 'Purchase Date', key: 'purchaseDate', width: 15 },
    { header: 'Purchase Cost ($)', key: 'purchaseCost', width: 15 },
    { header: 'Manufacturer', key: 'manufacturer', width: 15 },
    { header: 'Model Number', key: 'modelNumber', width: 15 },
    { header: 'Condition', key: 'condition', width: 12 },
    { header: 'Location', key: 'location', width: 18 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  assets.forEach(a => {
    worksheet.addRow({
      assetTag: a.assetTag,
      assetName: a.assetName,
      category: a.category,
      department: a.department,
      currentHolder: a.currentHolder || 'None',
      serialNumber: a.serialNumber,
      purchaseDate: a.purchaseDate,
      purchaseCost: a.purchaseCost,
      manufacturer: a.manufacturer || '',
      modelNumber: a.modelNumber || '',
      condition: a.condition,
      location: a.location || '',
      status: a.status
    });
  });

  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4D7CFF' }
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};
