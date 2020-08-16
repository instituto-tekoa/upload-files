# upload-files

A lib é responsável por funcionar como um wrapper na comunicação com o S3. 

## Utilização

No arquivo package.json
```
"upload-files": "https://github.com/Instituto-Arandu/upload-files.git",
```
Ao utilizar no código

```javascript
import Uploader from 'upload-files'
const Uploader = require('upload-files') 
```

A classe <b> Uploader </b> precisa ser inicializada e algumas variáveis de ambiente são requeridas (arquivo .env). 

```
REACT_APP_URL= //local onde a aplicação está rodando

SECRET_IV= //crypto
SECRET_KEY= //crypto

AWS_ACCESS_KEY= //access key do S3
AWS_SECRET_KEY= //secret key do S3
BUCKET= //nome do bucket do S3
```

## Exemplo utilizando o Multer

Front-end
```html
//HTML 
<input accept="image/*" onChange={handleFile} type="file"/>

//React.js Material-UI
<TextField type="file" onChange={handleFile} inputProps={{ "accept":"image/*" }}/>       									               
```

```javascript
const handleFile = async (e) => {		
  e.preventDefault();

  const data = new FormData();
  data.append("file", e.target.files[0]);   
  data.append("attribute", "attributeValue")
  
  await api.post('/', data)
};

```


Back-end
```javascript
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Uploader = require('upload-files');

router.post('/', upload.single("file"), async (req, res) => {      
  const uploader = new Uploader();
  
  const { attribute } = req.body;

  const response = await uploader.send("NOME_DA_PASTA/NOME_DO_ARQUIVO", req.file.mimetype, req.file.buffer);
  
  // response.Location será o link criptografado da AWS para o arquivo
  ...
}
```
