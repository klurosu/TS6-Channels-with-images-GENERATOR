import React, {useContext, useState} from 'react';
import Step from "./step";
import {Button, Callout, Code, FileInput, FormGroup, Icon, InputGroup} from "@blueprintjs/core";
import styled from 'styled-components';
import {ImageManipulationContext} from "./imageManipulation";
import {toaster} from "../pages";

const ImagePreview = styled.img`
  width: 300px;
  object-fit: contain;
  border: 1px solid rgb(255 255 255 / 20%);
`

const ImagePreviewPlaceholder = styled.div`
  height: 250px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(0 0 0 / 20%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 5px;
`

const UploadStep = styled(Step)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
`

const Col = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: ${props => props.$width ?? 30};
  min-width: 330px;
`

const FileSupportCallout = styled(Callout)`
  min-width: 100%;
  margin-bottom: 2rem;
`

const LoadButton = styled(Button)`
  width: 85px;
`

/**
 * Loads image from url using image HTML element (used for testing CORS issues)
 *
 * @param src
 * @return {Promise<unknown>}
 */
const loadCrossOriginImage = (src) => {
    return new Promise(((resolve, reject) => {
        const imageElement = document.createElement('img');
        imageElement.onload = resolve;
        imageElement.onerror = reject;
        imageElement.src = src;
    }))
}

/**
 * Converts File blob to Data URL
 *
 * @param file Blob
 * @return {Promise<unknown>}
 */
const fileToDataURL = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result)
        }
        reader.readAsDataURL(file);
    })
}

/**
 * Export metadata (width, height) from the image specified by URL
 *
 * @param url URL of the image
 * @return {Promise<unknown>}
 */
export const getImageMetadataFromDataURL = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onerror = reject
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
            })
        }
        // img.crossOrigin = "Anonymous"
        img.src = url;
    })
}


const Upload = () => {
    const {sourceImage, setSourceImage} = useContext(ImageManipulationContext);
    const [loadUrl, setLoadUrl] = useState("");
    const [isUrlLoading, setIsUrlLoading] = useState(false);

    /**
     * Handles uploading of the image using file input form
     *
     * @param e Input change event
     * @return {Promise<void>}
     */
    const uploadHandler = async (e) => {
        const file = e.target.files[0];

        if (file == null) return;

        const dataURL = await fileToDataURL(file);

        const metadata = await getImageMetadataFromDataURL(dataURL);

        setSourceImage({
            data: dataURL,
            width: metadata.width,
            height: metadata.height,
            name: file.name
        })
    }

    /**
     * Handles loading of image from the given URL
     *
     * @return {Promise<void>}
     */
    const loadHandler = async () => {
        setIsUrlLoading(true);

        try {
            // Tries to load image using fetch to get network error (primarily needed to catch CORS events) that can't
            // be caught because when loading fails inside canvas it does not produce Exception.
            await fetch(loadUrl);

            // TODO: Instead of fetched image from the internet two times data from first fetch should be encoded to
            //  base64URL and then used to process image

            const metadata = await getImageMetadataFromDataURL(loadUrl);

            setIsUrlLoading(false);
            setSourceImage({
                data: resizedImageDataURL,
                width: metadata.width,
                height: metadata.height,
                name: "loaded"
            })
        } catch (e) {
            console.error(e);

            // When error occurs when loading image from url we will try to load it again using HTML img element.
            // If this second attempt work we can be pretty sure that issue is in the CORS and we can show appropriate
            // error message to the user.
            try {
                await loadCrossOriginImage(loadUrl);
                toaster.show({
                    intent: "danger",
                    message: <>Parece que el sitio desde el que estás intentando cargar imágenes no permite que otras páginas web accedan a ellas.
                        Descargue la imagen y súbela manualmente. <a
                            href={'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'}>more information
                            here</a>.</>,
                    icon: "error"
                })
            } catch (x) {
                toaster.show({
                    intent: "danger",
                    message: <>No se puede cargar la imagen desde la URL. Comprueba si se trata de una URL válida para la imagen, una dirección local
                        como <code>file://</code> or <code>C://</code> no funcionará.</>,
                    icon: "error"
                })
            }
            setIsUrlLoading(false);
        }
    }

    return (
        <UploadStep number={1}>
            <Col $width={'calc(100% - 350px)'}>
                <FileSupportCallout intent={"primary"} title={"Supported image formats"}>
                    Los formatos de imagen compatibles dependen de su navegador, pero en general todos los formatos de imagen modernos
                    deberían funcionar correctamente.
                    Los banners animados aún no son compatibles y se convertirán en estáticos.
                    Las imágenes de salida tienen una resolución de <Code>500x22</Code> píxeles, por lo que el tamaño óptimo para la imagen de entrada es
                    una anchura de <Code>500px</Code> y una altura que se pueda dividir de forma uniforme1..
                </FileSupportCallout>
                <Col $width={'50%'}>
                    <FormGroup
                        label="Image File"
                        helperText={<>Sube la imagen que deseas convertir en banners para habitaciones..<br/>Las imágenes no se
                            suben al servidor y todo el procesamiento se realiza en el navegador..</>}
                        labelFor="file-input"
                        labelInfo="(Subir desde tu ordenador)"
                    >
                        <FileInput
                            style={{width: 330}}
                            fill={true}
                            inputProps={{
                                accept: 'image/*'
                            }}
                            id={'file-input'}
                            text={sourceImage.name ?? 'Choose file...'}
                            onInputChange={uploadHandler}
                            large={true}
                        />
                    </FormGroup>
                </Col>
                <Col $width={'50%'}>
                    <FormGroup
                        label="Image URL"
                        helperText="Cargar imagen desde URL"
                        labelFor="file-url"
                        labelInfo="(Load from the internet)"
                    >
                        <InputGroup
                            style={{width: 330}}
                            large={true}
                            fill={true}
                            onChange={(e) => {
                                setLoadUrl(e.target.value)
                            }}
                            placeholder="Image URL..."
                            rightElement={<LoadButton
                                loading={isUrlLoading}
                                large={true}
                                onClick={loadHandler}
                                disabled={loadUrl.length === 0}
                            >Load</LoadButton>}
                            value={loadUrl}
                        />
                    </FormGroup>
                </Col>
            </Col>
            <Col $width={'250px'} style={{justifyContent: 'flex-end'}}>
                {
                    sourceImage.data
                        ? <ImagePreview src={sourceImage.data} alt="Image Preview"/>
                        : <ImagePreviewPlaceholder>
                            <Icon icon={"media"} iconSize={50}/>
                        </ImagePreviewPlaceholder>
                }
            </Col>
        </UploadStep>
    );
};

export default Upload;
