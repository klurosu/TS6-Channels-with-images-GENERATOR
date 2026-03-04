import {ServerStyleSheet} from 'styled-components'
import Document, {Head, Html, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta property={'description'} content={`Herramienta para generar imágenes de fondo para canales en el
                     nuevo cliente TeamSpeak 6. Sube cualquier imagen y se dividirá en varias imágenes que 
                     podrás utilizar fácilmente como banners en tus canales.`}/>

                    <meta property="og:title" content="Generador de imágenes de canales de TeamSpeak 6"/>
                    <meta property="og:description" content="Herramienta para generar imágenes de fondo para canales en
                    TeamSpeak 6."/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:image" content="https://i.imgur.com/5YSmahN.png"/>
                </Head>
                <body className={'bp3-dark'}>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}
