import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
    const devMap = await prisma.map.upsert({
        where: { id: "totesacuid" },
        update: {},
        create: {
            id: "totesacuid",
            name: "defaultDevMap",
            filePath: "test",
        }
    })

    const explorerJeff = await prisma.construct.upsert({
      where: { id: "alsototesacuid" },
      update: {},
      create: {
          id: "alsototesacuid",
          name: "Explorer Jeff",
          mapId: "totesacuid",
          posX: 450,
          posY: 650,
      }
    })

    const explorerDan = await prisma.construct.upsert({
      where: { id: "anothercuid" },
      update: {},
      create: {
          id: "anothercuid",
          name: "Explorer Dan",
          mapId: "totesacuid",
          posX: 425,
          posY: 610,
      }
    })

    console.log({ devMap, explorerJeff, explorerDan })
  }
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })