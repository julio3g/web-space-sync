'use client'

import { DateTimePicker } from '@/components/datetime-picker'
// import { DateTimePicker } from '@/components/date-time-picker/date-time-picker'
import MultipleSelector, { Option } from '@/components/multi-select'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { transformBytesInKb } from '@/utils/transformerFile'
import { zodResolver } from '@hookform/resolvers/zod'
import { CloudUpload, Image as ImageLucide, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const CITY: Option[] = [
  { label: 'Caçador', value: 'caçador' },
  { label: 'Campos Novos', value: 'campos novos' },
  { label: 'Fraiburgo', value: 'fraiburgo' },
  { label: 'Videira', value: 'videira' },
  { label: 'Videira Atacadista', value: 'vda' },
  { label: 'Chapecó Atacadista', value: 'chap' },
]

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
})

const createAndSendMessageSchema = z.object({
  name: z.string().min(1, { message: 'Insira um nome' }),
  city: z
    .array(optionSchema)
    .min(1, { message: 'Selecione pelo menos uma cidade' }),
  datetime: z.coerce.date({
    required_error: 'Insira uma data e hora para programar o envio da mensagem',
  }),
  copywriter: z.string().min(1, { message: '' }),
  attachments: z
    .array(
      z.object({
        file: z.any(),
      }),
    )
    .min(1, { message: 'Envie pelo menos uma imagem' }),
})

export type createAndSendMessageFormData = z.infer<
  typeof createAndSendMessageSchema
>

export default function SendMessage() {
  const [uploadQueue, setUploadQueue] = useState<File[]>([])

  const setDatetime = new Date()
  setDatetime.setMinutes(setDatetime.getMinutes() + 30)
  setDatetime.setSeconds(0)

  const form = useForm<createAndSendMessageFormData>({
    resolver: zodResolver(createAndSendMessageSchema),
    defaultValues: {
      name: '',
      city: [],
      datetime: setDatetime,
      copywriter: '',
      attachments: [],
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': [],
    },
    onDrop: handleStartUpload,
    maxSize: 1024 * 1024 * 50,
  })

  function onSubmit(values: createAndSendMessageFormData) {
    console.log(values)
  }

  // const handleStartUpload = useCallback()

  function handleStartUpload(files: File[]) {
    setUploadQueue([...uploadQueue, ...files])

    // files.forEach((file: File) => {
    //   setUploadQueue((prevFiles: any) => [
    //     ...prevFiles,
    //     { file, progress: 0, size: file.size },
    //   ])

    //   const formData = new FormData()
    //   formData.append('files', file)

    //   const config = {
    //     onUploadProgress: (progressEvent: any) => {
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total,
    //       )
    //       // Atualiza o progresso do arquivo específico
    //       setUploadQueue((prevFiles: any) =>
    //         prevFiles.map((f: any) =>
    //           f.file.name === file.name
    //             ? { ...f, progress: percentCompleted }
    //             : f,
    //         ),
    //       )
    //     },
    //   }
    // })
  }

  function removeFileOnUploadQueue(fileToRemove: File) {
    setUploadQueue((currentQueue) =>
      currentQueue.filter((file) => file.name !== fileToRemove.name),
    )
  }

  return (
    <main className="max-w-screen-lg m-auto">
      <h1 className="text-3xl text-slate-950 ">Criar novo envio</h1>
      <div className="max-w-screen-md w-full p-6 m-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Digite um nome..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={CITY}
                    placeholder="Selecione as cidades..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opções de agendamento</FormLabel>
                  <FormDescription>
                    Agende seu envio de mensagem para os momentos em que sua
                    audiência está mais ativa, ou selecione manualmente uma data
                    e hora futura para enviar sua mensagem.
                  </FormDescription>
                  <DateTimePicker
                    aria-label="Select a date"
                    granularity="second"
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="copywriter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm text-slate-950">
                    Copywriter
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      autoComplete="off"
                      placeholder="Digite aqui..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attachments"
              render={() => (
                <FormItem>
                  <>
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
                      <input
                        type="file"
                        id="files"
                        multiple
                        {...getInputProps()}
                      />
                    </>
                    <div className="space-y-3">
                      {uploadQueue.map((file) => (
                        <div
                          key={file.name}
                          className="border rounded-lg flex justify-between gap-3 p-3"
                        >
                          <div className="flex gap-3">
                            <div className="p-2 rounded-full bg-slate-200">
                              <ImageLucide />
                            </div>
                            <div>
                              <p className="text-sm text-slate-950 font-medium">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {transformBytesInKb(file.size)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant={'ghost'}
                            className="p-2"
                            onClick={() => removeFileOnUploadQueue(file)}
                          >
                            <Trash2 size={20} className="stroke-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
