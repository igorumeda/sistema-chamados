import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import firebase from '../../services/firebaseConnection'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser, FiEdit, FiTrash, FiPlus } from 'react-icons/fi'

import './customers.css'

export default function Customers(){

    const [loading, setLoading] = useState(false);

    const [clientes, setClientes] = useState([]);
    const [clienteInEdit, setClienteInEdit] = useState({});

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    useEffect(() => {
        getClientes();
    }, [])

    async function getClientes(){

        await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {

                let lista = [];
                
                snapshot.forEach((item) => {
                    lista.push({
                        id: item.id,
                        nomeFantasia: item.data().nomeFantasia,
                        cnpj: item.data().cnpj,
                        endereco: item.data().endereco
                    })
                })

                setClientes(lista);

            })

    }

    async function handleSave(e){

        e.preventDefault();
        setLoading(true);

        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){

            let cliente = Object.getOwnPropertyNames(clienteInEdit);

            if(cliente.length === 0){
                addCliente();
            }else{
                editCliente(clienteInEdit.id);
            }

            getClientes();
            
        }else{
            setLoading(false);
            toast.error("Preencha os campos corretamente");
        }

    }

    async function addCliente(){

        await firebase.firestore().collection('customers')
        .add({
            nomeFantasia: nomeFantasia,
            cnpj: cnpj,
            endereco: endereco
        })
        .then(() => {
            setNomeFantasia('');
            setCnpj('');
            setEndereco('');
            setLoading(false);
            toast.success('Salvo com sucesso');
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
            toast.error(error.message);
        })

    }

    async function editCliente(id){

        await firebase.firestore().collection('customers')
            .doc(id)
            .update({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=>{
                setLoading(false);
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                setClienteInEdit({});
                getClientes();
                toast.success("Salvo com sucesso");
            })
            .catch((error)=>{
                console.log(error);
                setLoading(false);
                toast.error(error.message);
            })

    }

    async function deleteCliente(id){

        if( window.confirm('Confirma a exclusão?') ){

            await firebase.firestore().collection('customers')
            .doc(id).delete()
            .then(()=>{
                getClientes();
                toast.success('Registro excluído com sucesso')
            })
            .catch((error)=>{
                console.log(error);
                toast.error(error.message);
            })

        }

    }

    return(
        <div>

            <Header />

            <div className='content'>

                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <button className='new' onClick={ ()=>{
                    setClienteInEdit({});
                    setNomeFantasia('');
                    setCnpj('');
                    setEndereco('');
                } } >
                    <FiPlus size={25} color="white"/>
                    Novo cliente
                </button>

                <br/>
                <br/>
                <br/>
                <br/>
                
                <div className='container'>
                    
                    <form className='form-profile customers' onSubmit={handleSave}>

                        <label>Nome fantasia</label>
                        <input type="text" placeholder='Nome Fantasia' value={nomeFantasia} onChange={ (e) => setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        <input type="text" placeholder='CNPJ' value={cnpj} onChange={ (e) => setCnpj(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" placeholder='Endereço' value={endereco} onChange={ (e) => setEndereco(e.target.value)} />

                        <button type="submit"> { loading ? 'Salvando...' : 'Salvar' } </button>

                    </form>

                </div>

                <div className='container table'>

                    <h2>Clientes cadastrados</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Nome Fantasia</th>
                                <th>Endereço</th>
                                <th className='action'>#</th>
                            </tr>
                        </thead>
                        <tbody>
                        { clientes.map((item) => {
                            return(                                
                                <tr key={item.id}>
                                    <td data-label="CNPJ">{item.cnpj}</td>
                                    <td data-label="Nome Fantasia">{item.nomeFantasia}</td>
                                    <td data-label="Endereço">{item.endereco}</td>
                                    <td className='action'>

                                        <button style={{backgroundColor: "#3583f6"}} className="action" onClick={ () => {
                                            setClienteInEdit(item)
                                            setNomeFantasia(item.nomeFantasia)
                                            setCnpj(item.cnpj)
                                            setEndereco(item.endereco)
                                        } } >
                                            <FiEdit color="white" size={17}/>
                                        </button>

                                        <button style={{backgroundColor: "#f6a935"}} className="action" onClick={ () => deleteCliente(item.id) }>
                                            <FiTrash color="white" size={17}/>
                                        </button>

                                    </td>
                                </tr>                                
                            )
                        }) }
                        </tbody>

                    </table>

                </div>
                
            </div>

        </div>
    )
}