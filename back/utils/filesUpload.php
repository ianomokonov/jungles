<?php
class FilesUpload{
    private $baseUrl = 'http://localhost/back/';
    public function upload($file, $path, $prefix){
        if(!file_exists($path)){
            mkdir($path);
        }
        if($file != null){
            $n = basename($prefix."_".$file['name']);
            $d = $path."/".$n;
            if(move_uploaded_file($file['tmp_name'], $d)){
                return('http://localhost/back/'.$d);
            }else{
                throw new Exception('Отсутствует имя файла', 400);
            }
        }
    }

    public function removeFile($filelink){
        $path = explode($this->baseUrl, $filelink);
        if($path[1] && file_exists($path[1])){
            unlink($path[1]);
        }
    }
}
