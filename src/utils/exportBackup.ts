import {
  Product,
  Supplier,
  StockLot,
  StockEntry,
  StockExit,
  StockMovement,
  DamageReport,
  ReplacementReceipt,
  Invoice,
  AuditLog
} from '../types/stock';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface StockBackupData {
  backupMetadata: {
    systemName: string;
    version: string;
    backupDate: string;
    exportedByUserId: string;
    exportedByUserName: string;
    description: string;
    monetaryPolicy: string;
    statistics: {
      totalProducts: number;
      totalSuppliers: number;
      totalLots: number;
      totalEntries: number;
      totalExits: number;
      totalMovements: number;
      totalDamageReports: number;
      totalReplacementReceipts: number;
      totalInvoices: number;
      totalAuditLogs: number;
    };
  };
  products: Product[];
  suppliers: Supplier[];
  stockLots: StockLot[];
  stockEntries: StockEntry[];
  stockExits: StockExit[];
  stockMovements: StockMovement[];
  damageReports: DamageReport[];
  replacementReceipts: ReplacementReceipt[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
}

/**
 * Generates and triggers the download of a complete offline JSON backup of all stock data.
 */
export async function exportStockBackupJSON(data: {
  products: Product[];
  suppliers: Supplier[];
  stockLots: StockLot[];
  stockEntries: StockEntry[];
  stockExits: StockExit[];
  stockMovements: StockMovement[];
  damageReports: DamageReport[];
  replacementReceipts: ReplacementReceipt[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  userId: string;
  userName: string;
}): Promise<string> {
  const now = new Date();
  const dateFormatted = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `backup_controle_estoque_${dateFormatted}.json`;

  const backupPayload: StockBackupData = {
    backupMetadata: {
      systemName: 'CONTROLE DE ESTOQUE',
      version: '2.4.0',
      backupDate: now.toISOString(),
      exportedByUserId: data.userId,
      exportedByUserName: data.userName,
      description: 'Cópia de segurança física manual fora do banco de dados.',
      monetaryPolicy: '100% livre de valores monetários, preços e custos conforme regra de negócio.',
      statistics: {
        totalProducts: data.products.length,
        totalSuppliers: data.suppliers.length,
        totalLots: data.stockLots.length,
        totalEntries: data.stockEntries.length,
        totalExits: data.stockExits.length,
        totalMovements: data.stockMovements.length,
        totalDamageReports: data.damageReports.length,
        totalReplacementReceipts: data.replacementReceipts.length,
        totalInvoices: data.invoices.length,
        totalAuditLogs: data.auditLogs.length
      }
    },
    products: data.products,
    suppliers: data.suppliers,
    stockLots: data.stockLots,
    stockEntries: data.stockEntries,
    stockExits: data.stockExits,
    stockMovements: data.stockMovements,
    damageReports: data.damageReports,
    replacementReceipts: data.replacementReceipts,
    invoices: data.invoices,
    auditLogs: data.auditLogs
  };

  const jsonString = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Record action in audit log
  try {
    const auditId = `audit_${Date.now()}`;
    await setDoc(doc(db, 'auditLogs', auditId), {
      id: auditId,
      action: 'EXPORTAR_BACKUP_JSON',
      entityType: 'SystemBackup',
      entityId: filename,
      details: `Backup manual gerado contendo ${data.products.length} produtos, ${data.stockMovements.length} movimentações, ${data.damageReports.length} ocorrências e ${data.stockLots.length} lotes.`,
      performedByUserId: data.userId,
      performedByName: data.userName,
      createdAt: now.toISOString()
    });
  } catch (err) {
    console.warn('Could not record backup audit log:', err);
  }

  return filename;
}
