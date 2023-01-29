export function htmlDoc(list) {
    return ` <!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        a {
            text-decoration: none;
            color: whitesmoke;
            font-size: large;
            font-weight: bold;
            padding: 5px;}
        ul {
            list-style: none;
            background-color: gray;
            border: 2px solid black;
            width: 90%;
            padding: 20px;
            margin: 30px}
        .file {
            margin: 30px;
            background-color: lightgray;
            border: 2px solid black;
            font-size:small;
            padding: 5px; 
            overflow-x: auto;
            overflow-y: auto;   
        }
        span {
            color:red;
        }
        form {
            background-color: gray;
            margin: 30px;
            padding: 10px;
            border: 2px solid black;
            color: whitesmoke;
        }
        input {
            background: beige;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 20px;
        }
        div {
            padding-bottom: 10px;
            font-size: 20px;
        }
    </style>
    <title>Document</title>
</head>
<body>
${list}
</body>
</html>`
}