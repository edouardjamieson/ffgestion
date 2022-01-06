import Cta from './Cta'
import Loader from './Loader'

export default function Layout({ children, title, hasButton, buttonLabel, buttonFontAwesomeClass, onButtonClick, isLoading, isValidating  }) {
    return (
        <>
            <div className="wrapper">

                {
                    title ? 
                    <div className="hero">
                        <h1 className="hero-title">{ title }</h1>
                        <div className="hero-separator"></div>
                        {
                            hasButton ?
                            <Cta
                                type="button"
                                text={buttonLabel}
                                icon={buttonFontAwesomeClass}
                                onClick={() => onButtonClick ? onButtonClick() : null}
                            /> : null
                        }

                    </div> : null
                }

                {/* children est les elements que nous passons dans notre component <Exemple> CONTENU À PASSER </Exemple> */}
                { isLoading ? <Loader /> : children }

            </div>
            {/* Met la page en "stand-by" le temps qu'on valide si besoin */}
            {
                isValidating ?
                <div className="validator">
                    <img src="/images/loading.svg" alt="chargement..." />
                </div>
                : null
            }
        </>
    )
}
