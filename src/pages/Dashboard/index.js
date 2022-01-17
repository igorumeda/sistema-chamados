import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiHome, FiPlus, FiSearch, FiEdit, FiTrash } from "react-icons/fi"
import firebase from '../../services/firebaseConnection'
import { format } from 'date-fns'

import Modal from '../../components/Modal'

import './dashboard.css'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Dashboard(){

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [chamados, setChamados] = useState([]);
    const [lastDocs, setLastDocs] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    const incrementLimit = 3;
    const [currentlimit, setCurrentLimit] = useState(incrementLimit);

    const listRef = firebase.firestore().collection('reports').orderBy('created', 'desc');

    useEffect(()=>{

        listChamados();

        return(
            <div></div>
        )

    },[])

    async function listChamados(){

        setChamados([]);

        await listRef.limit(currentlimit)
        .get()
        .then((snapshot)=>{
            updateState(snapshot);
        })
        .catch((error)=>{
            console.log(error);
            setLoadingMore(false);
            toast.error(error.message);
        })

        setLoading(false);

    }

    async function updateState(snapshot){

        const isCollectionEmpty = snapshot.size === 0

        if(!isCollectionEmpty){

            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    clienteId: doc.data().clienteId,
                    clienteNome: doc.data().clienteNome,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);

        }else{

            setIsEmpty(true);

        }

        setLoadingMore(false);

    }

    async function handleMore(){

        setLoadingMore(true);

        await listRef.startAfter(lastDocs).limit(incrementLimit)
        .get()
        .then((snapshot)=>{
            updateState(snapshot);
            setCurrentLimit( currentlimit + incrementLimit );
        })
        .catch((error)=>{
            console.log(error);
            toast.error(error.message);
        })

    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal);
        setDetail(item);
    }

    async function deleteReport(id){

        if( !window.confirm('Confirma a exclusão do registro?') ){
            return
        }

        await firebase.firestore().collection('reports')
        .doc(id)
        .delete()
        .then(()=>{
            toast.success('Registro excluído com sucesso');
            listChamados();
        })
        .catch((error)=>{
            console.log(error);
            toast.error(error.message);
        })

    }

    if(loading){
        return(
            <div>

                <Header/>

                <div className="content">
                    
                    <Title name="Chamados">
                        <FiHome size={25} />
                    </Title>

                    <div className='container dashboard' >
                        <span>Carregando...</span>
                    </div>

                </div>

            </div>
        )
    }

    return(
        <div>

            <Header/>

            <div className="content">
                
                <Title name="Chamados">
                    <FiHome size={25} />
                </Title>

                {chamados.length === 0 ? (
                    <div className="container dashboard">

                        <span>Nenhum chamado registrado</span>

                        <Link to="" className='new'>
                            <FiPlus size={25} color="white"/>
                            Novo chamado
                        </Link>

                    </div>
                ) : (
                    <>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="white"/>
                            Novo chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>

                                {chamados.map((item, index)=>{
                                    return(

                                    <tr key={index}>
                                        <td data-label="Cliente"> { item.clienteNome } </td>
                                        <td data-label="Assunto"> { item.assunto } </td>
                                        <td data-label="Status">
                                            <span className='badge' style={{ backgroundColor: item.status === "Em Aberto" ? '#5cb85c' : '#999' }}> { item.status } </span>
                                        </td>
                                        <td data-label="Cadastrado em"> { item.createdFormated } </td>
                                        <td data-label="#">
                                            <button style={{backgroundColor: "#3583f6"}} className="action" onClick={ () => togglePostModal(item) }>
                                                <FiSearch color="white" size={17}/>
                                            </button>
                                            <Link style={{backgroundColor: "#f6a935"}} className="action" to={`/new/${item.id}`}>
                                                <FiEdit color="white" size={17}/>
                                            </Link>
                                            <button style={{backgroundColor: "red"}} className="action" onClick={ () => deleteReport(item.id) }>
                                                <FiTrash color="white" size={17}/>
                                            </button>
                                        </td>
                                    </tr>

                                    )
                                })}
 
                            </tbody>
                        </table>

                        { loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }}> Carregando... </h3> }
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}> Buscar mais </button> }

                    </>
                )}

            </div>
            
        {showPostModal && (
            <Modal conteudo={detail} close={togglePostModal} />
        )}

        </div>
    )
    
}