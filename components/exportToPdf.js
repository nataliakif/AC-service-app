import * as Print from "expo-print";

export const exportToPDF = async (data) => {
  // Создание контента для экспорта в PDF

  // Создание PDF из контента
  const pdfFile = await Print.printToFileAsync({ html: content });

  // Открытие диалога сохранения файла
  if (pdfFile.uri) {
    await Print.printAsync({ uri: pdfFile.uri });
  }
};
