### ¿Cuándo es contraproducente crear un índice? (pista: piensa en tablas con muchas escrituras).
Un índice acelera las lecturas, pero ralentiza las escrituras, por lo que es contraproducente usar un índice en caso de querer hacer INSERT, UPDATE o DELETE constantemente, por ejemplo: operaciones que cambian mucho contenido o están constantemente modificando datos. 

### ¿Qué diferencia hay entre RANK() y DENSE_RANK()? Pon un ejemplo con los datos de la base de datos.
RANK(): asigna el mismo valor en caso de empate y se salta el siguiente valor. Ejemplo: si hay un empate en el 1º puesto, esos valores tendrán el 1 pero el siguiente valor pasará a ser el 3.

DENSE_RANK(): asigna el mismo valor en caso de empate, peor no se salta el siguiente valor. Ejemplo: si hay un empate en el 1º puesto, esos valores tendrán el 1 pero el siguiente valor pasará a ser el 2.

Ejemplo: ranking de peliculas según su puntuación media.

### ¿Por qué el trigger usa AFTER INSERT OR UPDATE OR DELETE en lugar de BEFORE?
Un trigger AFTER se usa porque la operación (INSERT, UPDATE o DELETE) ya ha ocurrido realmente, así que el trigger trabaja con datos definitivos. Además, solo se ejecuta si la operación fue exitosa, lo que evita registrar o recalcular cosas que podrían haberse cancelado.