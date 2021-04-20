import { expect } from 'chai';
import ResourceType from '../src/enums/ResourceType';
import DiskError from '../src/errors/DiskError';
import InvalidResourceType from '../src/errors/InvalidResourceType';
import Resources from '../src/models/Resources';
import StatusData from '../src/models/StatusData';
import DiskManager from '../src/services/DiskManager';
import InstanceIdByTokenStrategy from '../src/services/InstanceIdByTokenStrategy';

const token = <string>process.env.TEST_TOKEN;
const idFromToken = new InstanceIdByTokenStrategy(token).get();

const manager = new DiskManager(token);

describe('DiskManager', () => {
  describe('getStatus', () => {
    it('should be instance of Status', async () => {
      const res = await manager.getStatus();
      expect(res).instanceOf(StatusData);
    });
  });

  describe('createDir', () => {
    afterEach(async () => {
      await manager.deleteResource(`/${idFromToken}/manager__create-dir__dir`);
    });

    it('sshould return true if the directory was sucessfully created', async () => {
      const res = await manager.createDir(`/${idFromToken}/manager__create-dir__dir`);
      expect(res).to.eq(true);
    });

    describe('directory already exists', () => {
      before(async () => {
        await manager.createDir(`/${idFromToken}/manager__create-dir__dir`);
      });

      it('should throw DiskError error if directory already exists', async () => {
        try {
          await manager.createDir(`/${idFromToken}/manager__create-dir__dir`);
        } catch (e) {
          expect(e).instanceOf(DiskError);
        }
      });
    });
  });

  describe('getResourceMetadata', async () => {
    it('should return the correct type if metadata for the directory was successfully retrieved', async () => {
      const res = await manager.getResourceMetadata('/');
      expect(res.type).to.eq(ResourceType.Directory);
    });

    describe('file', () => {
      before(async () => {
        await manager.uploadFile(Buffer.from('hello world'), {
          folder: '/',
          filename: 'manager__get-resource-metadata__file',
        });
      });

      after(async () => {
        await manager.deleteResource(`/${idFromToken}/manager__get-resource-metadata__file`);
      });

      it('should return the correct type if metadata for the file was successfully retrieved', async () => {
        const res = await manager.getResourceMetadata(
          `/${idFromToken}/manager__get-resource-metadata__file`,
        );
        expect(res.type).to.eq(ResourceType.File);
      });
    });
  });

  describe('getDirList', () => {
    it('should be instance of Resources', async () => {
      const res = await manager.getDirList('/');
      expect(res).instanceOf(Resources);
    });

    describe('file', () => {
      before(async () => {
        await manager.uploadFile(Buffer.from('hello world'), {
          folder: '/',
          filename: 'manager__get-dir-list__file',
        });
      });

      after(async () => {
        await manager.deleteResource(`/${idFromToken}/manager__get-dir-list__file`);
      });

      it('should throw InvalidResourceType when trying to apply getDirList to a file', async () => {
        try {
          await manager.getDirList(`/${idFromToken}/manager__get-dir-list__file`);
        } catch (e) {
          expect(e).instanceOf(InvalidResourceType);
        }
      });
    });
  });

  describe('getFileLink', () => {
    describe('directory', () => {
      it('should throw InvalidResourceType when trying to get link to a directory', async () => {
        try {
          await manager.getFileLink('/');
        } catch (e) {
          expect(e).instanceOf(InvalidResourceType);
        }
      });
    });

    describe('file', () => {
      before(async () => {
        await manager.uploadFile(Buffer.from('hello world'), {
          folder: '/',
          filename: 'manager__get-file-link__file',
        });
      });

      after(async () => {
        await manager.deleteResource(`/${idFromToken}/manager__get-file-link__file`);
      });

      it('should return a link to the file if successfully retrieved', async () => {
        const res = await manager.getFileLink(`/${idFromToken}/manager__get-file-link__file`);
        expect(res.url).to.be.a('string');
      });
    });
  });

  describe('uploadFile', () => {
    const buffer = Buffer.from('hello world');
    // Buffer.from('hello world') => 2aae6c

    describe('without options', () => {
      after(async () => {
        await manager.deleteResource(`/${idFromToken}/2aae6c`);
      });

      it('should return the path to the file if successfully uploaded', async () => {
        const res = await manager.uploadFile(buffer);
        expect(res).to.be.a('string');
      });
    });

    describe('with options.filename', () => {
      after(async () => {
        await manager.deleteResource(`/${idFromToken}/42ad4f`);
      });

      it('should return the path to the file if successfully uploaded', async () => {
        // Buffer.from('hello world 2') => 42ad4f
        const res = await manager.uploadFile(Buffer.from('hello world 2'), {
          filename: 'manager__upload-file__file',
        });
        expect(res).to.be.a('string');
      });
    });

    describe('with options.extension', () => {
      after(async () => {
        await manager.deleteResource(`/${idFromToken}/2aae6c`);
      });

      it('should return path to file if successfully uploaded file', async () => {
        const res = await manager.uploadFile(buffer, { extension: 'bin' });
        expect(res)
          .to.be.a('string')
          .and.matches(/\.bin?/);
      });
    });

    describe('with options.folder', () => {
      after(async () => {
        await manager.deleteResource(`/${idFromToken}/manager__upload-file__dir`);
      });

      it('should return the path to the file if successfully uploaded', async () => {
        const res = await manager.uploadFile(buffer, {
          folder: '/manager__upload-file__dir',
        });
        expect(res).to.be.a('string');
      });
    });
  });

  describe('deleteResource', () => {
    it("should throw a disk error if the resource doesn't exist", async () => {
      try {
        await manager.deleteResource(
          `/${idFromToken}/manager__delete-resource__nonexistent-resource`,
        );
      } catch (e) {
        expect(e).instanceOf(DiskError);
      }
    });

    describe('directory', () => {
      before(async () => {
        await manager.createDir(`/${idFromToken}/manager__delete-resource__dir`);
      });

      it('should return true on successful deletion', async () => {
        const res = await manager.deleteResource(`/${idFromToken}/manager__delete-resource__dir`);
        expect(res).to.eq(true);
      });
    });

    describe('file', () => {
      before(async () => {
        await manager.uploadFile(Buffer.alloc(1), {
          folder: '/',
          filename: 'manager__delete-resource__file',
        });
      });

      it('should return true on successful deletion', async () => {
        const res = await manager.deleteResource(`/${idFromToken}/manager__delete-resource__file`);
        expect(res).to.eq(true);
      });
    });
  });
});
