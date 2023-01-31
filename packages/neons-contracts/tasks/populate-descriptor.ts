import { task, types } from 'hardhat/config';
import ImageData from '../../neons-assets/src/image-data.json';
import { dataToDescriptorInput } from './utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x5CF75D795aae445a7D1e349cb708C5c9F1D617Ab',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    '0xC931C5939B5f28589ce1a8f1C7a0128cD343F62e',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers, network }) => {
    const options = { gasLimit: network.name === 'hardhat' ? 30000000 : undefined };

    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
    const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
    const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
    const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));

    await descriptorContract.addManyBackgrounds(bgcolors);
    await descriptorContract.setPalette(0, `0x000000${palette.join('')}`);
    await descriptorContract.addBodies(
      bodiesPage.encodedCompressed,
      bodiesPage.originalLength,
      bodiesPage.itemCount,
      options,
    );
    await descriptorContract.addHeads(
      headsPage.encodedCompressed,
      headsPage.originalLength,
      headsPage.itemCount,
      options,
    );
    await descriptorContract.addGlasses(
      glassesPage.encodedCompressed,
      glassesPage.originalLength,
      glassesPage.itemCount,
      options,
    );
    await descriptorContract.addAccessories(
      accessoriesPage.encodedCompressed,
      accessoriesPage.originalLength,
      accessoriesPage.itemCount,
      options,
    );

    console.log('Descriptor populated with palettes and parts.');
  });

/*

    const Images = [NeonsData, OGData];
    const { bgcolors, palette } = NeonsData;

    await descriptorContract.addManyBackgrounds(bgcolors);
    await descriptorContract.setPalette(0, `0x000000${palette.join('')}`);

    for (let i = 0; i < Images.length; ++i) {
      const ImageData = Images[i];
      const { images } = ImageData;
      const { bodies } = images;

      const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));

      await descriptorContract.addBodies(
        bodiesPage.encodedCompressed,
        bodiesPage.originalLength,
        bodiesPage.itemCount,
        options,
      );
    }

    for (let i = 0; i < Images.length; ++i) {
      const ImageData = Images[i];
      const { images } = ImageData;
      const { heads } = images;
      const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));

      await descriptorContract.addHeads(
        headsPage.encodedCompressed,
        headsPage.originalLength,
        headsPage.itemCount,
        options,
      );
    }

    for (let i = 0; i < Images.length; ++i) {
      const ImageData = Images[i];
      const { images } = ImageData;
      const { glasses } = images;
      const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));

      await descriptorContract.addGlasses(
        glassesPage.encodedCompressed,
        glassesPage.originalLength,
        glassesPage.itemCount,
        options,
      );
    }

    for (let i = 0; i < Images.length; ++i) {
      const ImageData = Images[i];
      const { images } = ImageData;
      const { accessories } = images;
      const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));

      await descriptorContract.addAccessories(
        accessoriesPage.encodedCompressed,
        accessoriesPage.originalLength,
        accessoriesPage.itemCount,
        options,
      );
    }

  */
