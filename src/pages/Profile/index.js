import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiSettings, FiUpload, FiUploadCloud } from 'react-icons/fi'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'

import Avatar from '../../assets/avatar.png'

export default function Profile() {

    const { user, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSave(e){
        
        e.preventDefault();

        setLoading(true);

        if(imageAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then((value)=>{
                let data = {
                    ...user,
                    nome: nome,
                }
                setUser(data);
                storageUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
                setLoading(false);
            })
        }else if(nome !== '' && imageAvatar !== null){
            handleUpload();
        }

    }

    async function handleUpload(){
        
        const currentId = user.uid;

        const uploadTask = await firebase.storage()
            .ref(`images/${currentId}/avatar`)
            .put(imageAvatar)
            .then( async () => {

                await firebase.storage().ref(`images/${currentId}`)
                    .child('avatar').getDownloadURL()
                    .then( async (url) => {
                        
                        await firebase.firestore().collection('users')
                        .doc(currentId)
                        .update({
                            avatarUrl: url,
                            nome: nome,
                        })
                        .then(() => {
                            let data = {
                                ...user,
                                avatarUrl: url,
                                nome: nome,
                            }

                            setAvatarUrl(url);
                            setUser(data);
                            storageUser(data);

                            toast.success('Foto atualizada com sucesso')
                            setLoading(false);

                        })
                        .catch((error) => {
                            console.log(error);
                            toast.error('Erro ao salvar');
                            setLoading(false);
                        })

                    })

            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao salvar a imagem')
                setLoading(false);
            })          

    }

    function handleFile(e){

        const image = e.target.files[0];

        if(image){

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                toast.error('Formato de imagem não permitido');
                setImageAvatar(null);
                return(null);
            }

        }

    }

    return(
        <div>

            <Header />
            
            <div className='content'>
                
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className='form-profile' onSubmit={handleSave}>

                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='white' size={25} />
                            </span>

                            <input type="file" accept='image/*' onChange={handleFile} /><br/>
                            { avatarUrl === null 
                                ? <img src={Avatar} alt="avatar" width="250" height="250" /> 
                                : <img src={avatarUrl} alt="avatar" width="250" height="250" /> 
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />
                        
                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">{ !loading ? 'Salvar' : 'Salvando...' }</button>

                    </form>
                </div>

            </div>

        </div>
    )
}