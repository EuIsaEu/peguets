import styles from '@/styles/Feed.module.css'

export default function feed() {
    return (
        <div id={styles.feed}>
            
            <div id={styles.main}>
                <div id={styles.publicacao}>
                    <a href='/profile'>clique para ver perfil</a>
                </div>
            </div>
        </div>
    )
}