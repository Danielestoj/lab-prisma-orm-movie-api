const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Insertando directores...");

  const directores = [
    "Christopher Nolan",
    "Denis Villeneuve",
    "Greta Gerwig",
    "Jordan Peele",
    "Alfonso Cuarón"
  ];

  for (const nombre of directores) {
    await prisma.director.upsert({
      where: { nombre },
      update: {},
      create: { nombre }
    });
  }

  console.log("Insertando géneros...");

  const generos = [
    { nombre: "Ciencia Ficción", slug: "ciencia-ficcion" },
    { nombre: "Drama", slug: "drama" },
    { nombre: "Terror", slug: "terror" },
    { nombre: "Animación", slug: "animacion" },
    { nombre: "Crimen", slug: "crimen" }
  ];

  for (const genero of generos) {
    await prisma.genero.upsert({
      where: { slug: genero.slug },
      update: {},
      create: genero
    });
  }

  console.log("Insertando películas...");

  const peliculas = [
    ["Inception", 2010, 8.8, "Christopher Nolan", "ciencia-ficcion"],
    ["Interstellar", 2014, 8.6, "Christopher Nolan", "ciencia-ficcion"],
    ["Oppenheimer", 2023, 8.5, "Christopher Nolan", "drama"],
    ["Dune", 2021, 8.0, "Denis Villeneuve", "ciencia-ficcion"],
    ["Blade Runner 2049", 2017, 8.0, "Denis Villeneuve", "ciencia-ficcion"],
    ["Arrival", 2016, 7.9, "Denis Villeneuve", "ciencia-ficcion"],
    ["Barbie", 2023, 6.9, "Greta Gerwig", "drama"],
    ["Lady Bird", 2017, 7.4, "Greta Gerwig", "drama"],
    ["Get Out", 2017, 7.7, "Jordan Peele", "terror"],
    ["Us", 2019, 6.8, "Jordan Peele", "terror"],
    ["Roma", 2018, 7.7, "Alfonso Cuarón", "drama"],
    ["Gravity", 2013, 7.7, "Alfonso Cuarón", "ciencia-ficcion"]
  ];

  for (const [titulo, anio, nota, directorNombre, generoSlug] of peliculas) {
    const director = await prisma.director.findUnique({ where: { nombre: directorNombre } });
    const genero = await prisma.genero.findUnique({ where: { slug: generoSlug } });

    await prisma.pelicula.upsert({
      where: { titulo },
      update: {},
      create: {
        titulo,
        anio,
        nota,
        director_id: director.id,
        genero_id: genero.id
      }
    });
  }

  console.log("Insertando reseñas...");

  const resenas = [
    ["Inception", "María", "Obra maestra del cine moderno", 9],
    ["Inception", "Carlos", "Confusa pero brillante", 8],
    ["Inception", "Ana", "La vi tres veces y cada vez entiendo más", 10],
    ["Dune", "Luis", "Visualmente impresionante", 9],
    ["Dune", "Sara", "Fiel al libro", 8],
    ["Oppenheimer", "Pedro", "Tres horas que pasan volando", 9],
    ["Barbie", "Elena", "Más profunda de lo que parece", 8],
    ["Barbie", "Tomás", "No era para mí", 5],
    ["Get Out", "Julia", "Perturbadora y necesaria", 9],
    ["Roma", "Miguel", "Poesía visual pura", 10]
  ];

  for (const [titulo, autor, texto, puntuacion] of resenas) {
    const pelicula = await prisma.pelicula.findUnique({ where: { titulo } });

    await prisma.resena.create({
      data: {
        pelicula_id: pelicula.id,
        autor,
        texto,
        puntuacion
      }
    });
  }

  console.log("Datos insertados correctamente.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
