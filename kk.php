<?php

function decryptEnc($encrypted)
{
    $encryptionMethod = "AES-256-CBC";
    $secretKey = "0TCJJ59QzctD8LXi+SUrhoHwxq+41t@1";
    $iv = "QzctD8LXi+SUrhoH";

    $decryptedText = openssl_decrypt($encrypted, $encryptionMethod, $secretKey, 0, $iv);
    return $decryptedText;
}


echo decryptEnc('KEvtFxYf2KQEpQSw9bIY7GTBemEanr7B9CAl3oCDASNE4Y365XlMCFVmtzPJs6dk2pelHzn5RHerFCnfhJhNH2QNeSeOmRpovpYbYEcnNbe+L92+/SLU31j9XKRrRG022/xTsbLNLA2P5S1ue/I88cBuNKX99itWfx1k7QPnM0RN3vH1ZhXTcMmv1s0oVak/09BBObRi+/RruqRddFGUoc4iiYM31sxsFeaZ2V9L17J9UrE7RsSbs7wLYUbFbQGw');
