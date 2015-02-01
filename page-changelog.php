<pre>
<?php

if (file_exists(TEMPLATEPATH."/changelog.txt")) {
    include("changelog.txt");
} else {
    echo "O arquivo de changelog não existe";
}

?>
</pre>