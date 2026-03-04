import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h1 {
    margin-top: 0;
    font-size: 1.5em;
  }

  .p {
    font-size: 1.2em;
    margin-bottom: 10px;
    margin-top: 0;
  }
`

const DonateButton = ({...other}) => (
    <form action="https://www.paypal.com/donate" method="post" target="_top" {...other}>
        <input type="hidden" name="hosted_button_id" value="J4DNSRBMJ6P9U"/>
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit"
               title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/>
        {/*<img alt="" border="0" src="https://www.paypal.com/en_SK/i/scr/pixel.gif" width="1" height="1"/>*/}
    </form>)

const DonateButtonStyled = styled(DonateButton)`
  display: inline;
  vertical-align: middle;
`

const GithubBadge = ({...other}) => (
    <iframe src="https://ghbtns.com/github-btn.html?user=pitkes22&repo=ts5-channel-image-generator&type=star&count=true"
            frameBorder="0" scrolling="0" width="150" height="20" title="GitHub" {...other}/>)

const StyledGithubBadge = styled(GithubBadge)`
  vertical-align: middle;
  margin-left: 0.6em;
`

const Description = () => {
    return (
        <Container>
            <h1>Generador de imágenes para canales de TeamSpeak 6</h1>
            <div className={'p'}>Herramienta para generar imágenes de fondo para canales de Teamspeak S6
                 <a href="https://teamspeak.com/en/downloads/#ts6client" target={'_blank'} rel="noopener"></a>.
                Sube cualquier imagen y se redimensionará y dividirá en varias imágenes que podrás utilizar fácilmente como
                banners en tus canales.
            </div>

            <div className={'p'}>If you like the project you can buy a beer 🍻 to the oginal dev <DonateButtonStyled/> or contribute to
                the project on <a href="https://github.com/pitkes22/ts5-channel-image-generator" target={'_blank'}>GitHub (bug
                    reports are welcomed)</a> !
            </div>
        </Container>
    );
};

export default Description;
