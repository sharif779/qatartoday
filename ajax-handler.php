<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token_arr= get_token();
    $token="";
    if(isset($token_arr['data']['token'])){
        $domain="http://go.247traffic.com/api/24option/?";
        $token=$token_arr['data']['token'];
        $post=$_POST;
        $data=array();
        $data['api_username']="imad15brah";
        $data['api_password']="2015WOrld";
        $data['module']="customer";
        $data['command']="add";
        $data['firstname']=$post['firstName'];
        $data['lastname']=$post['lastName'];
        if(empty($post['email']) || $post['email']=="your-name@somedomain.com"){
            $timestamp=time();
            $data['email']="sample_email_".$timestamp."@email.com";
        }else{
            $data['email']=$post['email'];
        }
        $data['phone']=$post['phone'];
        $data['password']="password";
        $data['country']=$post['country'];
        $data['language']="AR";
        $query_string= http_build_query($data);
        $url=$domain.$query_string;
        $res=api_request($url);
        $return=array();
        if($res['res']){
            if(isset($res['data']['errors'])){
                $return['success']=false;
                $return['message']=$res['data']['errorsMessage']['message'];
            }else{
                $return['success']=true;
                $return['message']="";
            }
        }else{
            $return['success']=false;
            $return['message']="Something went wrong";
        }
        echo json_encode($return);
    }
}
function get_token(){
    ini_set('max_execution_time', 300000);
    $curl = curl_init();
    curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.europrime.com/consumer/login",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => "{\n  \"username\": \"IMAD\",\n  \"password\": \"Ji8^7fW@\"\n}",
    CURLOPT_HTTPHEADER => array(
      "content-type: application/json",
      "user-agent: api user/v1.0.0"
    ),
  ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
      return array("res"=>false);
    } else {
      return array("res"=>false,"data"=> json_decode($response,true));
    }

}
 function api_request($url,$is_post=false,$data=array()){
     ini_set('max_execution_time', 300000);
     $curl = curl_init();
        // Set some options - we are passing in a useragent too here
        //for get request
        if(!$is_post){
            curl_setopt_array($curl, [
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_URL => $url,
            ]);
        }else{
            curl_setopt_array($curl, [
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_URL => $url,
                CURLOPT_POST => 1,
                CURLOPT_POSTFIELDS => $data
            ]);
        }

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    $xml = simplexml_load_string($response, "SimpleXMLElement", LIBXML_NOCDATA);
    $json = json_encode($xml);
    $array = json_decode($json,TRUE);
    if ($err) {
        return array("res"=>false);
      } else {
        return array("res"=>true,"data"=> $array);
      }
 }

 
 // Function to get the client IP address
function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}