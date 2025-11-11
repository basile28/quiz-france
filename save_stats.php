<?php
header('Content-Type: application/json');
$file='stats.json';
if(!file_exists($file)) file_put_contents($file,'{}');
$input=json_decode(file_get_contents('php://input'),true);
if(isset($input['__full_replace']) && $input['__full_replace']===true && isset($input['data'])){
    file_put_contents($file,json_encode($input['data']));
    echo json_encode(['status'=>'ok']); exit;
}
if($input){
    $current=json_decode(file_get_contents($file),true);
    $new=array_merge($current,$input);
    file_put_contents($file,json_encode($new));
    echo json_encode(['status'=>'ok']);
}
