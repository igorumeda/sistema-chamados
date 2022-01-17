import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import logo from '../../assets/logo.png';

function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nome, setNome] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){

    e.preventDefault();

    if(nome !== '' && email !== '' && password !== ''){
      signUp(email,password,nome);
    }

  }

  return (
    <div className='container-center'>
      <div className='login'>

        <div className='login-area'>
          <img src={logo} alt="logotipo" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <h1>Criar minha conta</h1>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="seuemail@provedor.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Sua senha"  value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirme a senha"  value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          <button type="submit"> {loadingAuth ? 'Carregando...' : 'Cadastrar'} </button>
        </form>

        <Link to="/">Já tem uma conta? Entre!</Link>

      </div>
    </div>
  );

}
  
export default SignUp;
  