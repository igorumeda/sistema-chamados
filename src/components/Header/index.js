import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import './header.css'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import { FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'

export default function Header(){

    const { user, signOut } = useContext(AuthContext);

    return(

        <div className='sidebar'>
        
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Avatar" />
            </div>

            <Link to="/dashboard">
                <FiHome color="white" size={24} />
                Chamados
            </Link>

            <Link to="/customers">
                <FiUser color="white" size={24} />
                Clientes
            </Link>

            <Link to="/profile">
                <FiSettings color="white" size={24} />
                Configurações
            </Link>

            <button className="logout" onClick={() => signOut()} >
                <FiLogOut color="white" size={24} />
                Sair
            </button>

        </div>

    )
}