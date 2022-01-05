import Link from "next/link"

export default function Cta({ type, text, icon, href, onClick }) {

    // ====================================================================
    // Construit un bouton / lien CTA
    // ====================================================================

    // Afin d'avoir le même contenu partout, on créer un autre component qui contiendra
    // le contenu du cta
    const CTAContent = () => {
        return (
            // La balise <></> est rien, il permet simplement d'englober du contenu afin d'éviter les erreurs
            <>
                <div className="cta-text">{ text }</div>
                {
                    icon !== false ?
                    <div className="cta-icon">
                        <i className={ icon ? icon : "fas fa-plus"}></i>
                    </div> : null
                }
            </>
        )
    }

    // Si le type est un bouton on return un bouton
    if(type === "button") {

        return <button type="button" className="cta" onClick={() => onClick ? onClick() : null}>
            <CTAContent />
        </button>


    // Sinon on return un lien
    }else if(type === "link") {

        return <Link href={href}>
            <CTAContent />
        </Link>

    }

}
