import { Command, CommandRunner } from 'nest-commander';
import { AssetsService } from './assets/assets.service';
import { WalletsService } from './wallets/wallets.service';
import { WalletAssetsService } from './wallets/wallet-assets/wallet-assets.service';
import { OrdersService } from './orders/orders.service';
import { PrismaService } from './prisma/prisma/prisma.service';

@Command({ name: 'simulate-assets-price' })
export class SimulateAssetsPriceCommand extends CommandRunner {
  constructor(
    private assetsService: AssetsService,
    private walletsService: WalletsService,
    private walletAssetsService: WalletAssetsService,
    private ordersService: OrdersService,
    private prismaService: PrismaService,
  ) {
    super();
  }

  async run(_passedParam: string[], _options?: any): Promise<void> {
    console.log('Simulating assets price...');
    await this.cleanDatabase();

    await this.createAssets();

    await this.createWallets();

    await this.createWalletAssets();

    await this.createOrders();
  }

  randomNumberInInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async cleanDatabase() {
    await this.prismaService.$transaction([
      this.prismaService.transaction.deleteMany({}),
      this.prismaService.walletAsset.deleteMany({}),
      this.prismaService.assetDaily.deleteMany({}),
      this.prismaService.assetHistory.deleteMany({}),
      this.prismaService.order.deleteMany({}),
      this.prismaService.asset.deleteMany({}),
      this.prismaService.wallet.deleteMany({}),
    ]);
    console.log('Database cleaned');
  }

  async createAssets() {
    await this.assetsService.create({
      id: 'asset1',
      price: 100,
      symbol: 'asset1',
    });
    console.log('asset1 created');
    await this.assetsService.create({
      id: 'asset2',
      price: 200,
      symbol: 'asset2',
    });
    console.log('asset2 created');
  }

  async createWallets() {
    await this.walletsService.create({
      id: 'wallet1',
    });
    console.log('wallet1 created');
    await this.walletsService.create({
      id: 'wallet2',
    });
    console.log('wallet2 created');
  }

  async createWalletAssets() {
    await this.walletAssetsService.create({
      asset_id: 'asset1',
      wallet_id: 'wallet1',
      shares: 10000,
    });
    await this.walletAssetsService.create({
      asset_id: 'asset2',
      wallet_id: 'wallet1',
      shares: 20000,
    });
    console.log('Wallet 1 assets created');

    await this.walletAssetsService.create({
      asset_id: 'asset1',
      wallet_id: 'wallet2',
      shares: 5000,
    });
    await this.walletAssetsService.create({
      asset_id: 'asset2',
      wallet_id: 'wallet2',
      shares: 1000,
    });
    console.log('Wallet 2 assets created');
  }

  async createOrders() {
    console.log('Creating orders...');
    const range = (start: number, end: number) =>
      Array.from({ length: end - start }, (_, i) => i + start);
    let p1: number;
    let p2: number;

    for (const index of range(1, 100)) {
      p1 = this.randomNumberInInterval(index, index * 10);
      p2 = this.randomNumberInInterval(index, index * 10);

      await this.ordersService.initTransaction({
        asset_id: 'asset1',
        wallet_id: 'wallet1',
        price: p1,
        shares: 100,
        type: 'SELL',
      });

      await this.ordersService.initTransaction({
        asset_id: 'asset1',
        wallet_id: 'wallet2',
        price: p1 + 1,
        shares: 100,
        type: 'BUY',
      });

      await this.ordersService.initTransaction({
        asset_id: 'asset2',
        wallet_id: 'wallet1',
        price: p2,
        shares: 100,
        type: 'SELL',
      });

      await this.ordersService.initTransaction({
        asset_id: 'asset2',
        wallet_id: 'wallet2',
        price: p2 + 1,
        shares: 100,
        type: 'BUY',
      });

      await sleep(2000);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
