"use client";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface FileViewerProps {
  file: File;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [fileURL, setFileURL] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalDocHTML, setOriginalDocHTML] = useState<string>("");
  const [originalExcelHTML, setOriginalExcelHTML] = useState<string>("");
  const docContainerRef = useRef<HTMLDivElement>(null);
  const excelContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    const isDoc =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword";
    if (isDoc && docContainerRef.current) {
      import("docx-preview")
        .then(({ renderAsync }) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const arrayBuffer = event.target?.result;
            if (arrayBuffer && docContainerRef.current) {
              renderAsync(arrayBuffer as ArrayBuffer, docContainerRef.current)
                .then(() => {
                  setOriginalDocHTML(docContainerRef.current!.innerHTML);
                })
                .catch(() => {
                  docContainerRef.current!.innerText =
                    "Erro ao renderizar o documento.";
                });
            }
          };
          reader.readAsArrayBuffer(file);
        })
        .catch(() => {
          if (docContainerRef.current) {
            docContainerRef.current.innerText =
              "Erro ao renderizar o documento.";
          }
        });
    }
  }, [file]);

  useEffect(() => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";
    if (isExcel && excelContainerRef.current) {
      import("xlsx")
        .then((XLSX) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const arrayBuffer = event.target?.result;
            if (arrayBuffer) {
              const wb = XLSX.read(arrayBuffer, { type: "array" });
              const firstSheetName = wb.SheetNames[0];
              const firstSheet = wb.Sheets[firstSheetName];
              const html = XLSX.utils.sheet_to_html(firstSheet);
              if (excelContainerRef.current) {
                excelContainerRef.current.innerHTML = html;
                setOriginalExcelHTML(html);
              }
            }
          };
          reader.readAsArrayBuffer(file);
        })
        .catch(() => {
          if (excelContainerRef.current) {
            excelContainerRef.current.innerText =
              "Erro ao renderizar o arquivo Excel.";
          }
        });
    }
  }, [file]);

  useEffect(() => {
    const escapeRegExp = (s: string) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const highlightText = (text: string, keyword: string): string => {
      if (!keyword) return text;
      const escaped = escapeRegExp(keyword);
      const regex = new RegExp(`(${escaped})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    };

    const isDoc =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword";
    if (isDoc && docContainerRef.current && originalDocHTML) {
      docContainerRef.current.innerHTML = highlightText(
        originalDocHTML,
        searchTerm
      );
    }

    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";
    if (isExcel && excelContainerRef.current && originalExcelHTML) {
      excelContainerRef.current.innerHTML = highlightText(
        originalExcelHTML,
        searchTerm
      );
    }
  }, [searchTerm, file, originalDocHTML, originalExcelHTML]);

  const isPDF = file.type === "application/pdf";
  const isDoc =
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword";
  const isExcel =
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-semibold mb-4">{file.name}</h2>
        {isDoc || isExcel ? (
          <input
            type="text"
            placeholder="Buscar palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
        ) : null}
        {isPDF ? (
          <embed
            src={fileURL}
            type="application/pdf"
            className="w-full h-[70vh]"
          />
        ) : isDoc ? (
          <div
            ref={docContainerRef}
            className="w-full h-[70vh] overflow-auto border p-4"
          ></div>
        ) : isExcel ? (
          <div
            ref={excelContainerRef}
            className="w-full h-[70vh] overflow-auto border p-4"
          ></div>
        ) : (
          <p>Tipo de arquivo não suportado para visualização.</p>
        )}
      </div>
    </div>
  );
}
