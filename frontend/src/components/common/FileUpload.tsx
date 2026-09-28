/**
 * FileUpload Component
 * 
 * Componente de carga de archivos con las siguientes características:
 * - Drag and drop support
 * - Validación de tipo de archivo
 * - Límites de tamaño de archivo
 * - Vista previa de imágenes
 * - Soporte para múltiples archivos
 * - Indicador de progreso
 * - Lista de archivos cargados con opción de eliminar
 * 
 * @example
 * // Uso básico
 * <FileUpload
 *   label="Cargar documento"
 *   name="document"
 *   onChange={(files) => console.log(files)}
 * />
 * 
 * // Con múltiples archivos y validación
 * <FileUpload
 *   label="Cargar imágenes"
 *   name="images"
 *   multiple
 *   accept="image/*"
 *   maxSize={5}
 *   onChange={(files) => setImages(files)}
 *   error="Selecciona al menos una imagen"
 * />
 */

import React, { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';

export interface FileUploadProps {
  /** Etiqueta del campo */
  label?: string;
  /** Nombre del campo */
  name?: string;
  /** Mensaje de error */
  error?: string | boolean;
  /** Texto de ayuda */
  helpText?: string;
  /** Callback cuando cambian los archivos */
  onChange?: (files: File[]) => void;
  /** Callback para eliminar un archivo */
  onRemove?: (file: File) => void;
  /** Archivos actuales */
  value?: File[];
  /** Clase CSS adicional */
  className?: string;
  /** Estado deshabilitado */
  disabled?: boolean;
  /** Campo requerido */
  required?: boolean;
  /** Permitir múltiples archivos */
  multiple?: boolean;
  /** Tipos de archivo aceptados (ej: "image/*", ".pdf,.doc") */
  accept?: string;
  /** Tamaño máximo por archivo en MB */
  maxSize?: number;
  /** Número máximo de archivos */
  maxFiles?: number;
  /** Mostrar vista previa de imágenes */
  showPreview?: boolean;
  /** Texto personalizado del botón */
  buttonText?: string;
  /** Texto de drag zone */
  dragText?: string;
  /** Mostrar progreso de carga */
  showProgress?: boolean;
  /** Progreso de carga (0-100) */
  uploadProgress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  error,
  helpText,
  onChange,
  onRemove,
  value = [],
  className = '',
  disabled = false,
  required = false,
  multiple = false,
  accept,
  maxSize = 10, // 10MB por defecto
  maxFiles,
  showPreview = true,
  buttonText = 'Seleccionar archivos',
  dragText = 'Arrastra archivos aquí o haz clic para seleccionar',
  showProgress = false,
  uploadProgress = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(value);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar archivo
  const validateFile = (file: File): string | null => {
    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${maxSize}MB`;
    }

    // Validar tipo
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const fileType = file.type;

      const isAccepted = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return fileExtension === acceptedType.toLowerCase();
        }
        if (acceptedType.endsWith('/*')) {
          const category = acceptedType.split('/')[0];
          return fileType.startsWith(category);
        }
        return fileType === acceptedType;
      });

      if (!isAccepted) {
        return `El archivo "${file.name}" no es un tipo de archivo válido`;
      }
    }

    return null;
  };

  // Procesar archivos seleccionados
  const processFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || newFiles.length === 0) return;

      setValidationError('');
      const fileArray = Array.from(newFiles);

      // Validar número máximo de archivos
      const totalFiles = files.length + fileArray.length;
      if (maxFiles && totalFiles > maxFiles) {
        setValidationError(
          `Solo puedes subir un máximo de ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}`
        );
        return;
      }

      // Validar cada archivo
      const validFiles: File[] = [];
      for (const file of fileArray) {
        const validationMsg = validateFile(file);
        if (validationMsg) {
          setValidationError(validationMsg);
          return;
        }
        validFiles.push(file);
      }

      // Actualizar archivos
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, maxFiles, multiple, onChange]
  );

  // Manejar cambio en input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Limpiar input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  // Manejar drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Manejar drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Manejar click en zona de drag
  const handleZoneClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Remover archivo
  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(f => f !== fileToRemove);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
    onRemove?.(fileToRemove);
  };

  // Verificar si es imagen
  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  // Obtener URL de vista previa
  const getPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (file: File): JSX.Element => {
    if (isImage(file)) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (file.type.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      return (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  const errorMessage = typeof error === 'string' ? error : validationError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        onChange={handleInputChange}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="hidden"
        aria-label={label || 'Cargar archivo'}
      />

      {/* Zona de drag and drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400 hover:bg-primary-50'}
          ${errorMessage ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <div className="space-y-2">
          {/* Icono de upload */}
          <div className="flex justify-center">
            <svg
              className={`w-12 h-12 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Texto */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">{dragText}</p>
            <p className="text-xs text-gray-500 mt-1">
              {accept && `Formatos: ${accept} • `}
              Tamaño máximo: {maxSize}MB
              {maxFiles && ` • Máximo ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Botón */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoneClick();
            }}
            disabled={disabled}
            className="
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              text-primary-600 bg-white border border-primary-600 rounded-lg
              hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {buttonText}
          </button>
        </div>

        {/* Barra de progreso */}
        {showProgress && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-2 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{uploadProgress}% completado</p>
          </div>
        )}
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              {/* Vista previa o icono */}
              {showPreview && isImage(file) ? (
                <img
                  src={getPreviewUrl(file)}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="flex-shrink-0">{getFileIcon(file)}</div>
              )}

              {/* Info del archivo */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>

              {/* Botón eliminar */}
              <button
                type="button"
                onClick={() => handleRemoveFile(file)}
                disabled={disabled}
                className="
                  flex-shrink-0 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
                aria-label={`Eliminar ${file.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}

      {/* Texto de ayuda */}
      {helpText && !errorMessage && (
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default FileUpload;
