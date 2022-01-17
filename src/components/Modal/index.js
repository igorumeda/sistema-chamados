import './modal.css'
import { FiX } from 'react-icons/fi'

export default function Modal({conteudo, close}){

    return(
        <div className='modal'>
            <div className='container'>

                <button className='close' onClick={ close } >
                    <FiX size={23} color='white' />
                    Voltar
                </button>

                <div className='row'>
                    <span>
                        Cliente: <i>{ conteudo.clienteNome }</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Assunto: <i>{ conteudo.assunto }</i>
                    </span>
                    <span>
                        Cadastrado em: <i>{ conteudo.createdFormated }</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Status: <i style={{ color: 'white', backgroundColor: conteudo.status === 'Em Aberto' ? '#5cb85c' : '#999' }}>{ conteudo.status }</i>
                    </span>
                </div>

                {conteudo.complemento !== '' && (
                    <div className='row'>
                        <span>Complemento</span>
                        <p>{conteudo.complemento}</p>
                    </div>
                )}

            </div>
        </div>
    )
}