import React, { useState, useEffect, Component } from "react";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const download = require("downloadjs");
const myTheme = {
    "menu.backgroundColor": "white",
    "common.backgroundColor": "#151515",
    "menu.normalIcon.path": icond,
    "menu.activeIcon.path": iconb,
    "menu.disabledIcon.path": icona,
    "menu.hoverIcon.path": iconc,
};



function ImgEditor(){
    const [imageSrc, setImageSrc] = useState("");
    const imageEditor = React.createRef();
    // constructor(props){
    //     super(props)
    //     this.set = {
    //         imageSrc :'',
    //     }
    // }

    // componentWillReceiveProps(props) {
    //     if(props.src !== this.props.src){
    //         console.log('yes')
    //         this.setState({ src: props.src });
    //     }
    //
    // }
    // handleCancel = () => {
    //     this.setState({ previewVisible: false });
    // };

    const saveImageToDisk = () => {
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const data = imageEditorInst.toDataURL();
        console.log(data)
        if (data) {
            const mimeType = data.split(";")[0];
            const extension = data.split(";")[0].split("/")[1];
            download(data, `image.${extension}`, mimeType);
        }
    };


        return (
            <div className="image-editor" >
                <div className="center">
                    <h1>Photo Editor</h1>
                    <Button className='button' onClick={saveImageToDisk}>Save Image to Disk</Button>
                </div>
                <ImageEditor
                    includeUI={{
                        loadImage: {
                            path: imageSrc,
                            name: "image",
                        },
                        theme: myTheme,
                        menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
                        initMenu: "",
                        uiSize: {
                            height: `calc(100vh - 160px)`,
                        },
                        menuBarPosition: "bottom",
                    }}
                    cssMaxHeight={window.innerHeight}
                    cssMaxWidth={window.innerWidth}
                    selectionStyle={{
                        cornerSize: 20,
                        rotatingPointOffset: 70,
                    }}
                    usageStatistics={true}
                    ref={imageEditor}
                />
            </div>
        );

}
export default ImgEditor;