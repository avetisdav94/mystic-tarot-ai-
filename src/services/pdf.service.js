import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function generateSpreadPDF(spread, cards, interpretation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `spread-${Date.now()}.pdf`;
      const stream = fs.createWriteStream(filename);

      doc.pipe(stream);

      // Заголовок
      doc.fontSize(20).text(spread.name, { align: 'center' });
      doc.moveDown();

      // Карты
      doc.fontSize(14).text('Карты:', { underline: true });
      cards.forEach((card, index) => {
        const position = spread.positions[index];
        doc.fontSize(12).text(`${index + 1}. ${position.name}: ${card.name}`);
      });
      doc.moveDown();

      // Толкование
      doc.fontSize(14).text('Толкование:', { underline: true });
      doc.fontSize(10).text(interpretation, { align: 'justify' });

      doc.end();

      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}