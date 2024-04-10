import QRCode from 'react-qr-code'
export default async function Home() {
  // const data = await api.post('instance/create', {
  //   instanceName: 'teste7',
  //   qrcode: true,
  //   number: '49991450440',
  // })

  // console.log(data?.response)

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col max-w-96 text-center ">
        <div className="flex flex-col gap-6 mb-8">
          <h1 className="font-bold text-2xl text-slate-950">
            Conecte-se ao WhatsApp
          </h1>
          <p className="text-sm text-slate-500">
            Conecte-se ao <b>WhatsApp</b> para iniciar o envio de mensagens.
          </p>
        </div>
        <div className="flex flex-col gap-6 border rounded-lg p-6 items-center bg-white">
          <p className="text-xs italic text-slate-400 px-5">
            Aponte seu telefone para esta tela para capturar o código QR
          </p>
          <div className="max-w-64 p-4 rounded-md border">
            <QRCode value="" fgColor="#020617" size={224} />
          </div>
          <p className="text-amber-500 italic leading-4 text-xs">
            É necessário vincular seu WhatsApp para acessar todas as
            funcionalidades do aplicativo.
          </p>
        </div>
      </div>
    </main>
  )
}
