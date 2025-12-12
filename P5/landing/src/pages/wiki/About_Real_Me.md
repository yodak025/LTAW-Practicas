---
layout: ../../layouts/WikiLayout.astro
title: "About_Real_Me"
---

# Seamos sinceros
Todo lo anterior no sirve para conocer a la persona detrás del teclado. Es por esto que he decidido crear esta página, con la idea de que se pueda entender un poco mejor quien soy yo, por si pudiese interesar a alguien.

## Soy jodidamente disperso
Me he esforzado por no perder demasiado tiempo con esto pero, como se puede ver, la tentación ha sido demasiado grande. Me gusta tomar el camino largo y complicarme la vida. Confío en que esto me llevará a lugares interesantes pero, muchas veces, el precio es demasiado alto.

## Sobre el precio 
Durante el año pasado, quise llevar al límite varios proyectos. Pero mastiqué más de lo que podía tragar y empecé la casa por el tejado en demasiadas ocasiones. Por eso, pasé por unos meses muy complicados. No hay que dramatizar, pero aprendí que hay que ser menos cabezota y más astuto a la hora de elegir como se emplea el tiempo. Por eso, he terminado el resto de la wiki antes de empezar esta parte. Y por supuesto, he acotado bastante el tiempo disponible para ella.

### Pequeña recomendación (Incluye la imagen)

Quiero recomendar la sexta canción del disco *Poesía Básica*, un proyecto musical lanzado en 2001 por una pintoresca agrupación conformada por integrantes de *Extremoduro* y *Platero y Tú*, junto con la colaboración de un poeta independiente conocido como *Manolo Chinato*. 

En ella, *Robe Iniesta* recita uno de los poemas de *Chinato*, acompañado por una pieza de rock sinfónico que enfatiza la emoción del texto. Creo que es interpretable, pero para mí el texto habla sobre el ciclo de la vida y la muerte. Muy recomendable

## Sobre los lugares interesantes
Bueno, dejémonos de mierdas intensitas y vayamos al turrón. Para incluir la pista de audio, he realizado un proceso de compresión por medio de la herramienta *ffmpeg*. 


### Conversión a AAC
El formato AAC es ampliamente compatible con navegadores y reproductores web. Para convertir un archivo MP3 a AAC con FFmpeg, he usado el siguiente comando:

```bash
ffmpeg -i input.mp3 -c:a aac -b:a 128k output.aac
```

#### Parámetros utilizados:
- `-i input.mp3`: Define el archivo de entrada en formato MP3.
- `-c:a aac`: Especifica el códec de audio AAC para la salida.
- `-b:a 128k`: Establece la tasa de bits en 128 kbps (puede ajustarse según la necesidad).
- `output.aac`: Nombre del archivo de salida en formato AAC.



### Conversión a Opus
El códec Opus ofrece una mayor eficiencia de compresión sin sacrificar calidad, aunque su compatibilidad con navegadores es menor. Valía la pena comprobarlo, por lo que utilicé el siguiente comando

```bash
ffmpeg -i input.mp3 -c:a libopus -b:a 96k output.opus
```

#### Nuevos parámetros:
- `-c:a libopus`: Utiliza el códec Opus.
- `-b:a 96k`: Configura la tasa de bits en 96 kbps, buscando realizar .

### Evaluación
El archivo original (MP3) ocupa un total de 9´41MB. Mediante la compresión a AAC, he conseguido reducirlo a 3'83MB, mientras que el archivo comprimido a Opus se ha  reducido a 2'85MB. Esto tiene, en realidad, más que ver con la tasa binaria seleccionada para cada conversión, pero la realidad es que no presentan grandes diferencias en cuanto a calidad. 

Esto es todo muy interesante, pero no he sido capaz de embeber los archivos en esta wiki. Por tanto, me veo obligado a recurrir a [el método más aburridamente eficiente para compartir música en nuestro tiempo](https-//www.youtube.com/watch?v=70J5rwZMHPk).

## Conclusión
Podría parecer que todo este proceso ha sido una pérdida de tiempo. Para algunos, quizá lo sea. Por desgracia, es innegable que el tiempo es finito,que tenemos obligaciones que atender. Pero no se debe confundir lo importante con lo urgente. No soy el primero en darme cuenta de que vivimos en un mundo que nos exprime hasta dejarnos secos. Y estoy completamente a favor de cuidar nuestro valioso tiempo. Pero, ¿desde cuando la experimentación es perder el tiempo? Experimentar es la única forma de aprender consistente en el largo plazo. Y, dicho sea de paso, es la mejor forma de disfrutar en el proceso, por lo que considero que es la forma correcta. Y sí, admito que no es la forma más rápida. Pero pienso que en un mundo con google maps no tiene ninguna gracia dedicarnos a buscar la ruta más corta. Así soy yo; me lío, me pierdo, me encuentro y aprendo de ello. En tanto que sirve para ilustrar mi punto, esta página supone una buena utilización de mi tiempo. 

## Despedida 
¡Casi lo olvido! Para comprimir la portada del álbum he utilizado [Squoosh](https-//squoosh.app/). A veces, da coraje lo bien que funcionan algunos proyectos open source. Pocas cosas me hacen confiar tanto en la humanidad con esto. ¡Nos vemos en la próxima!
