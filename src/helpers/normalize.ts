//C:\javacelikoglu\frontend\src\helpers\normalize.ts
export function normalizeCategory(category: string) {
  return category
    .toLowerCase()
    .normalize('NFD') // Türkçe karakterleri ayırır
    .replace(/[\u0300-\u036f]/g, '') // Ayırdığı işaretleri siler
    .replace(/\s+/g, '-')            // Boşlukları tire yapar
    .replace(/[^a-z0-9-]/g, '');     // Güvenli karakterler dışındakileri temizler
}
