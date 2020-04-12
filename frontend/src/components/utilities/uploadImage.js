import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import axios from 'axios';
import { Form,
        Button,
        Upload,
        Input,
        Modal,
        Typography,
        message, } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import ImgEditor from "../imgeditor/imgeditor";
import TextArea from 'antd/lib/input/TextArea';


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

const { Title} = Typography;
const formItemLayout = {
    labelCol: {
        span: 4,
      },
  wrapperCol: {
    span: 14,
  },
};

const buttonLayout = {
    wrapperCol: {
        span: 14,
        offset: 4,
        }
}
const titleLayout = {
    wrapperCol: {
        span: 14,
        offset: 9,
      },
}

const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList.slice(-process.env.REACT_APP_MAX_POST_PICTURE_NUMBER);
  };

const API_END_POINT = process.env.REACT_APP_BASE_URL;




class UploadImage extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            loading: false,
            title: '',
            description: '',
            fileList: [],
            file: null,
            checked: false,
            latitude: '',
            longitude: '',
            address: '',
        };
        this.customSubmit = this.customSubmit.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    onReset = () => {
        this.formRef.current.resetFields();
        this.setState({
            fileList:[]
        })
    };

    setAddress = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng =>
                this.setState({
                    latitude: latLng.lat,
                    longitude : latLng.lng
                }),
                message.success('Successfully fetched location info'))
            .catch(error => console.error('Error', error));
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };


    beforeUpload=(file)=> {
        const
            isJpegOrJpgOrPngOrGif = file.type === 'image/jpeg'
            || file.type === 'image/jpg'
            || file.type === 'image/png'
            || file.type === 'image/gif';
        if (!isJpegOrJpgOrPngOrGif) {
            message.error('You can only upload JPEG/JPG/PNG/GIF file!');
            file.status = 'error';
        }
        return isJpegOrJpgOrPngOrGif;

    };

    handleFileChange = ({fileList}) => {
        this.setState({
            fileList: fileList
        });
    };

    removeFile(file) {
        const index = this.state.fileList.indexOf(file);
        const newFileList = this.state.fileList.slice();
        newFileList.splice(index, 1);
        this.setState({fileList: newFileList});
    }

    handleCancel = () => {
        this.setState({ previewVisible: false });
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    
    customSubmit = () => {
        let data= new FormData();
        if (this.state.fileList.length === 0){
            message.error("images cannot be empty");
            return;
        }else{
            for (let i=0; i<this.state.fileList.length; i++){
                data.append('picture', this.state.fileList[i].originFileObj);
            }
        }

        if (this.state.title.length > process.env.REACT_APP_MAX_POST_TITLE_LENGTH){
            message.error("title must be less than 30 characters");
            return;
        }else{
            data.append('title', this.state.title);
        }
        if (this.state.description.length > process.env.REACT_APP_MAX_POST_DES_LENGTH){
            message.error("description must be less than 200 characters");
            return;
        }else{
            data.append('description', this.state.description);
        }
        data.append('latitude', this.state.latitude);
        data.append('longitude', this.state.longitude);
        data.append('address', this.state.address);

        const config= {
            headers: {
                "content-type": "multipart/form-data",
            },
            withCredentials: true
        };
        
        axios
            .post(API_END_POINT+'/api/posts', data, config)
            .then((res) => {
                message.success("The Post is sent");
                this.props.refresh();
            }).catch((err) => {
                message.error(err.response.data);
            });
        this.onReset();
    };
    
    render(){
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return(
            <Form
                ref={this.formRef}
                name="uploadImage"
                {...formItemLayout}
                onFinish={this.customSubmit}
            >
                <Form.Item {...titleLayout}>
                    <Title>New Moment</Title>
                </Form.Item>

                <Form.Item name="Images"
                           label="Select to Upload"
                           valuePropName="upload"
                >
                    <Upload
                        name={"upload"}
                        customRequest={dummyRequest}
                        multiple={true}
                        listType="picture-card"
                        fileList={this.state.fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleFileChange}
                        beforeUpload={this.beforeUpload}
                    >
                        {this.state.fileList.length >= 9 ? null : uploadButton}
                    </Upload>
                    <Modal
                        visible={this.state.previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        width={1300}
                        height={600}
                    >
                        <ImgEditor src={this.state.previewImage} />
                        {/*<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />*/}
                    </Modal>
                </Form.Item>


                <Form.Item 
                    name={['Title']}
                    label="Title"
                    {...formItemLayout}
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                    <Input 
                    name="title"
                    placeholder="Title" 
                    value={this.state.title}
                    onChange={this.handleChange}
                    />
                </Form.Item>

                <Form.Item 
                    name={['Description']}
                    label="Description"
                    {...formItemLayout}
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                    <TextArea 
                    name="description"
                    placeholder="Description" 
                    value={this.state.description}
                    onChange={this.handleChange}/>
                </Form.Item>

                <Form.Item
                    name="Location"
                    label="Location (Optional)"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.setAddress}
                        onSelect={this.handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <Input
                                    {...getInputProps({
                                        placeholder: 'Search Places ... (use arrow keys to select)',
                                        className: 'location-search-input',
                                    })}
                                />
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style,
                                                })}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </Form.Item>

                <Form.Item
                    {...buttonLayout}
                >
                    <Button 
                    type="primary" 
                    htmlType="submit"
                    >
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        );
        
    }
    
}
export default UploadImage;