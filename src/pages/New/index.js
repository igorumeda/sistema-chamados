import { useState, useEffect, useContext } from 'react'
import AuthProvider, { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { FiPlus } from 'react-icons/fi'
import './new.css'

export default function New(){

    const { id } = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Em Aberto');
    const [complemento, setComplemento] = useState('');

    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomersSelected] = useState(0);

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        listCustomers();

    },[]);

    async function loadId(lista){

        await firebase.firestore().collection('reports')
        .doc(id)
        .get()
        .then((snapshot)=>{

            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);
            
            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)

            setCustomersSelected(index);
            setIdCustomer(true);

        })
        .catch((error)=>{
            console.log(error);
            toast.error(error.message);
        })

    }

    async function listCustomers(){

        await firebase.firestore().collection('customers')
        .get()
        .then((snapshot)=>{

            let lista = [];

            snapshot.forEach((item)=>{
                lista.push({
                    id: item.id,
                    nomeFantasia: item.data().nomeFantasia,
                })
            })

            if(lista.length === 0){
                toast.info('Nenhum cliente encontrado')
                setCustomers([ {id: 0, nomeFantasia: ''} ])
                setLoadCustomers(false);
                return;
            }

            setCustomers(lista);
            setLoadCustomers(false);

            if(id){
                loadId(lista);
            }

        })
        .catch((error)=>{
            console.log(error);
            toast.error(error.message);
            setLoadCustomers(false);
            setCustomers([ {id: 0, nomeFantasia: ''} ])
        })

    }

    async function handleSave(e){
        
        e.preventDefault();
        setLoading(true);

        if(idCustomer){

            await firebase.firestore().collection('reports')
            .doc(id)
            .update({
                createdId: user.uid,
                clienteId: customers[customerSelected].id,
                clienteNome: customers[customerSelected].nomeFantasia,
                assunto: assunto,
                status: status,
                complemento: complemento,
            })
            .then(()=>{
                toast.success('Salvo com sucesso')
                history.push('/dashboard');
            })
            .catch((error)=>{
                console.log(error);
                toast.error(error.message);
            })

            return;

        }

        await firebase.firestore().collection('reports')
        .add({
            created: new Date(),
            createdId: user.uid,
            clienteId: customers[customerSelected].id,
            clienteNome: customers[customerSelected].nomeFantasia,
            assunto: assunto,
            status: status,
            complemento: complemento,
        })
        .then(()=>{
            setAssunto('Suporte');
            setStatus('Em Aberto');
            setComplemento('');
            setCustomersSelected(0);
            setLoading(false);
            toast.success('Salvo com sucesso');
        })
        .catch((error)=>{
            setLoading(false);
            console.log(error);
            toast.error(error.message);
        })

    }

    function changeCliente(e){
        setCustomersSelected(e.target.value);
    }

    function changeAssunto(e){
        setAssunto(e.target.value);
    }

    function changeStatus(e){
        setStatus(e.target.value);
    }

    return(
        <div>

            <Header />

            <div className='content'>

                <Title name="Novo chamado">
                    <FiPlus size={25}/>
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleSave}>

                        <label>Cliente</label>
                        
                        { loadCustomers 
                            ? ( <input type="text" value="Carregando" disabled /> ) 
                            : (
                                <select value={customerSelected} onChange={changeCliente} >
                                    { customers.map((item, index)=>{
                                        return(
                                            <option key={item.id} value={index}> { item.nomeFantasia } </option>
                                        )
                                    }) }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={changeAssunto}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita técnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            
                            <input type="radio" name="radio" value="Em Aberto" onChange={changeStatus} checked={ status === "Em Aberto" } />
                            <span>Em aberto</span>

                            <input type="radio" name="radio" value="Em Progresso" onChange={changeStatus} checked={ status === "Em Progresso" } />
                            <span>Em progresso</span>

                            <input type="radio" name="radio" value="Atendido" onChange={changeStatus} checked={ status === "Atendido" } />
                            <span>Atendido</span>

                        </div>

                        <label>Complemento</label>
                        <textarea type="text" placeholder='Descreva os detalhes (opcional)' value={complemento} onChange={ (e) => {setComplemento(e.target.value)} } />

                        <button type="submit"> { loading ? 'Salvando...' : 'Salvar' } </button>

                    </form>

                </div>

            </div>

        </div>
    )
}