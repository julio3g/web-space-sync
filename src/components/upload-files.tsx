import { addUploadsAtom } from '@/state/upload'
import { useSetAtom } from 'jotai'
import { CloudUpload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export function UploadDropArea() {
  const addUploads = useSetAtom(addUploadsAtom)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    onDrop: addUploads,
    maxSize: 524_288_000, // 500mb
  })

  return (
    <>
      <label
        htmlFor="files"
        className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-slate-50 p-4 text-sm text-slate-600 hover:bg-slate-100 data-[drag-active=true]:border-primary data-[drag-active=true]:bg-primary dark:bg-slate-900 dark:text-slate-400"
        data-drag-active={isDragActive}
        {...getRootProps()}
      >
        <div className="p-2.5 rounded-full bg-slate-200">
          <CloudUpload className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <span className="font-normal text-sm">
            <b>Clique para fazer upload</b> ou arraste e solte
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Tamanho máximo do arquivo 50 MB.
          </span>
        </div>
      </label>
      <input type="file" id="files" multiple {...getInputProps()} />
    </>
  )
}
