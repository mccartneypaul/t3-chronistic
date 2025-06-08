import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const devWorld = await prisma.world.upsert({
    where: { id: "myworldscuidwowowow" },
    update: {},
    create: {
      id: "myworldscuidwowowow",
      name: "defaultDevWorld",
      userId: "ChangeThisToYourUserId",
    },
  });

  const devMap = await prisma.map.upsert({
    where: { id: "totesacuid" },
    update: {},
    create: {
      id: "totesacuid",
      worldId: "myworldscuidwowowow",
      name: "defaultDevMap",
      filePath: "middleearth.jpg",
    },
  });

  const explorerJeff = await prisma.construct.upsert({
    where: { id: "alsototesacuid" },
    update: {},
    create: {
      id: "alsototesacuid",
      name: "Explorer Jeff",
      description:
        "Test this too. Wow. this is a great description.  Really world class. Everyone agrees. \n \n The other guy is the worst ever.  Everyone agress.",
      mapId: "totesacuid",
      posX: 450,
      posY: 650,
    },
  });

  const explorerDan = await prisma.construct.upsert({
    where: { id: "anothercuid" },
    update: {},
    create: {
      id: "anothercuid",
      name: "Explorer Dan",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi urna, aliquam nec bibendum eu, ornare a leo. Maecenas facilisis nisi quis posuere euismod. Pellentesque urna arcu, congue vitae nisl eu, tincidunt suscipit quam. Phasellus eget velit ante. In eu nulla ac purus iaculis commodo. Suspendisse ultrices ut sem nec euismod. Donec efficitur eros eu sollicitudin luctus. Nulla porta efficitur elit, et luctus turpis gravida dapibus. Maecenas pharetra magna nunc, vel consectetur odio aliquam ac. Cras auctor purus a enim luctus suscipit. Aliquam ultricies, libero at iaculis iaculis, nibh est hendrerit purus, id dignissim neque magna ut ligula. Vestibulum sit amet velit porta nisi ultrices condimentum ac quis augue. Nam id nibh viverra, euismod nunc a, iaculis mi. Curabitur auctor, ex eget interdum imperdiet, ipsum ligula mattis nisl, et venenatis ex purus pretium eros. Nulla sagittis pulvinar maximus.",
      mapId: "totesacuid",
      posX: 425,
      posY: 610,
    },
  });

  const testMap = await prisma.map.upsert({
    where: { id: "anotherblastedcuid" },
    update: {},
    create: {
      id: "anotherblastedcuid",
      worldId: "myworldscuidwowowow",
      name: "testDevMap",
      filePath: "TestWorldMap.png",
    },
  });

  const seaSerpent = await prisma.construct.upsert({
    where: { id: "anotherwhatsacuid" },
    update: {},
    create: {
      id: "anotherwhatsacuid",
      name: "Sea Serpent",
      description: "Lives in the sea.  It's a serpent.  What more do you want?",
      mapId: "anotherblastedcuid",
      posX: 425,
      posY: 610,
    },
  });

  console.log({ devMap, explorerJeff, explorerDan });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
