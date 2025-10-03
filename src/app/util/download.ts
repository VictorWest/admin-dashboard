import jsPDF from "jspdf";

export const handleDownload = async (data: object) => {
  const doc = new jsPDF();
  doc.setFontSize(10);

  let y = 10; // vertical position

  // Recursive helper
  const printData = (obj: any, indent = 0) => {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        doc.text(`${" ".repeat(indent)}[${i}]`, 10, y);
        y += 6;
        printData(item, indent + 2);
      });
    } else if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          doc.text(`${" ".repeat(indent)}${key}:`, 10, y);
          y += 6;
          printData(value, indent + 2);
        } else {
          doc.text(
            `${" ".repeat(indent)}${key}: ${value ?? ""}`,
            10,
            y
          );
          y += 6;
        }
      });
    }
  };

  // Print JSON recursively
  printData(data);

  doc.save("output.pdf");
};