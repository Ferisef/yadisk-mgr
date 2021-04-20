import { expect } from 'chai';
import DiskInstance from '../src/services/DiskInstance';
import DiskError from '../src/errors/DiskError';
import ResourceType from '../src/enums/ResourceType';
import Resources from '../src/models/Resources';
import InvalidResourceType from '../src/errors/InvalidResourceType';
import StatusData from '../src/models/StatusData';

const instance = new DiskInstance(String(process.env.TEST_TOKEN));

describe.skip('DiskInstance', () => {
  describe('getStatus', () => {
    it('should be instance of Status', async () => {
      const res = await instance.getStatus();
      expect(res).instanceOf(StatusData);
    });
  });

  describe('createDir', () => {
    afterEach(async () => {
      await instance.deleteResource('/instance__create-dir__dir');
    });

    it('should return true if the directory was sucessfully created', async () => {
      const res = await instance.createDir('/instance__create-dir__dir');
      expect(res).to.eq(true);
    });

    describe('directory already exists', () => {
      before(async () => {
        await instance.createDir('/instance__create-dir__dir');
      });

      it('should throw DiskError if the directory already exists', async () => {
        try {
          await instance.createDir('/instance__create-dir__dir');
        } catch (e) {
          expect(e).instanceOf(DiskError);
        }
      });
    });
  });

  describe('getResourceMetadata', async () => {
    it('should return the correct type if metadata for the directory was successfully retrieved', async () => {
      const res = await instance.getResourceMetadata('/');
      expect(res.type).to.eq(ResourceType.Directory);
    });

    describe('file', () => {
      before(async () => {
        await instance.uploadFile(Buffer.from('hello world'), {
          folder: '/',
          filename: 'instance__get-resource-metadata__file',
        });
      });

      after(async () => {
        await instance.deleteResource('/instance__get-resource-metadata__file');
      });

      it('should return the correct type if metadata for the file was successfully retrieved', async () => {
        const res = await instance.getResourceMetadata('/instance__get-resource-metadata__file');
        expect(res.type).to.eq(ResourceType.File);
      });
    });
  });

  describe('getDirList', () => {
    it('should be instance of Resources', async () => {
      const res = await instance.getDirList('/');
      expect(res).instanceOf(Resources);
    });

    describe('file', () => {
      before(async () => {
        await instance.uploadFile(Buffer.from('hello world'), {
          folder: '/',
          filename: 'instance__get-dir-list__file',
        });
      });

      after(async () => {
        await instance.deleteResource('/instance__get-dir-list__file');
      });

      it('should throw InvalidResourceType when trying to apply getDirList to a file', async () => {
        try {
          await instance.getDirList('/instance__get-dir-list__file');
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
          await instance.getFileLink('/');
        } catch (e) {
          expect(e).instanceOf(InvalidResourceType);
        }
      });
    });

    describe('file', () => {
      before(async () => {
        await instance.uploadFile(Buffer.alloc(1), {
          folder: '/',
          filename: 'instance__get-file-link__file',
        });
      });

      after(async () => {
        await instance.deleteResource('/instance__get-file-link__file');
      });

      it('should return a link to the file if successfully retrieved', async () => {
        const res = await instance.getFileLink('/instance__get-file-link__file');
        expect(res.url).to.be.a('string');
      });
    });
  });

  describe('uploadFile', () => {
    const buffer = Buffer.from('hello world');
    // Buffer.from('hello world') => 2aae6c

    describe('without options', () => {
      after(async () => {
        await instance.deleteResource('/2aae6c');
      });

      it('should return the path to the file if successfully uploaded', async () => {
        const res = await instance.uploadFile(buffer);
        expect(res).to.be.a('string');
      });
    });

    describe('with options.filename', () => {
      after(async () => {
        await instance.deleteResource('/42ad4f');
      });

      it('should return the path to the file if successfully uploaded', async () => {
        // Buffer.from('hello world 2') => 42ad4f
        const res = await instance.uploadFile(Buffer.from('hello world 2'), {
          filename: 'instance__upload-file__file',
        });
        expect(res).to.be.a('string');
      });
    });

    describe('with options.extension', () => {
      after(async () => {
        await instance.deleteResource('/2aae6c');
      });

      it('should return path to file if successfully uploaded file', async () => {
        const res = await instance.uploadFile(buffer, { extension: 'bin' });
        expect(res)
          .to.be.a('string')
          .and.matches(/\.bin?/);
      });
    });

    describe('with options.folder', () => {
      after(async () => {
        await instance.deleteResource('/instance__upload-file__dir');
      });

      it('should return the path to the file if successfully uploaded', async () => {
        const res = await instance.uploadFile(buffer, {
          folder: '/instance__upload-file__dir',
        });
        expect(res).to.be.a('string');
      });
    });
  });

  describe('deleteResource', () => {
    it("should throw a disk error if the resource doesn't exist", async () => {
      try {
        await instance.deleteResource('/instance__delete-resource__nonexistent-resource');
      } catch (e) {
        expect(e).instanceOf(DiskError);
      }
    });

    describe('directory', () => {
      before(async () => {
        await instance.createDir('/instance__delete-resource__dir');
      });

      it('should return true on successful deletion', async () => {
        const res = await instance.deleteResource('/instance__delete-resource__dir');
        expect(res).to.eq(true);
      });
    });

    describe('file', () => {
      before(async () => {
        await instance.uploadFile(Buffer.alloc(1), {
          folder: '/',
          filename: 'instance__delete-resource__file',
        });
      });

      it('should return true on successful deletion', async () => {
        const res = await instance.deleteResource('/instance__delete-resource__file');
        expect(res).to.eq(true);
      });
    });
  });
});
