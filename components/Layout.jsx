import Cta from './Cta'

export default function Layout({ children, title, hasButton, buttonLabel, buttonFontAwesomeClass, onButtonClick  }) {
    return (
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
            { children }
        </div>
    )
}
