class DiskInstanceConstants {
  public static readonly dirListFields = [
    '_embedded.items.name',
    '_embedded.items.size',
    '_embedded.items.type',
    '_embedded.items.media_type',
    '_embedded.items.created',
    '_embedded.items.modified',
    '_embedded.sort',
  ];

  public static readonly metadataFields = ['type'];
}

export default DiskInstanceConstants;
