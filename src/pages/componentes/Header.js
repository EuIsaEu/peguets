import styles from '../../styles/components.module.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Header() {
    const [usuario, setUsuario] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (usuarioAutenticado) => {
            setUsuario(usuarioAutenticado);
        });

        return () => {
            unsub();
        };
    }, []);

    const logout = () => {
        signOut(auth)
            .then(() => {
                // localStorage.setItem("user-credentials")
                console.log('Deslogado');
            })
            .catch((error) => {
                console.log('Erro ao deslogar: ', error.message);
            });
    };

    return (
        <div id={styles.header}>
            <div id={styles.logoDiv}>
                <img id={styles.icon} src='heart-icon.png' alt="Logo"></img>
                <h1>Peguets</h1>
            </div>
            <nav>
                {usuario ? (
                    <>
                        <a href='/feed'>feed</a>
                        <button id={styles.deslogar} onClick={logout}>deslogar</button>
                    </>
                ) : (
                    <>
                        <a href='/login'>login</a>
                        <a href='/registro'>cadastro</a>
                    </>
                )}
            </nav>
        </div>
    );
}