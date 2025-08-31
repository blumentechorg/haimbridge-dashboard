import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "./mock";

export async function exportToCSV(data: Transaction[], filename: string) {
	const csv = Papa.unparse(data);
	downloadBlob(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

export async function exportToPDF(data: Transaction[], filename: string) {
	const doc = new jsPDF();
	
	// Add title
	doc.setFontSize(16);
	doc.text("Financial Report", 14, 20);
	doc.setFontSize(10);
	doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
	
	// Add table
	autoTable(doc, {
		startY: 40,
		head: [["Date", "Stream", "Amount Declared", "Amount Remitted", "Payment Method"]],
		body: data.map((item) => [
			new Date(item.date).toLocaleDateString(),
			item.stream,
			`$${item.amountDeclared.toLocaleString()}`,
			`$${item.amountRemitted.toLocaleString()}`,
			item.paymentMethod,
		]),
		styles: {
			fontSize: 8,
		},
		headStyles: {
			fillColor: [66, 66, 66],
		},
	});
	
	doc.save(`${filename}.pdf`);
}

function downloadBlob(content: string, filename: string, type: string) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
