const base=require('../service/base.js')

//获取所有在线节点
exports.onlineNodes=base.onlineNode;

exports.state=base.state;



//获取对应节点所有处理服务
exports.onlineNodesAllPcs=base.onlineNodesAllPcs;
//执行处理方法
exports.excuteProcess=base.excuteProcess;
// 调用其他节点处理方法
exports.invokeDistributedPc=base.invokeDistributedPc

// 调用处理方法
exports.invokeUrlDataPcs=base.invokeUrlDataPcs
// 调用处理方法，数据是多个url
exports.invokeUrlsDataPcs=base.invokeUrlsDataPcs
//带key，重命名
exports.invokeExternalUrlsDataPcsWithKeys=base.invokeExternalUrlsDataPcsWithKeys

// 调用处理方法，数据是urls，外部数据
exports.invokeExternalUrlsDataPcs=base.invokeExternalUrlsDataPcs;
// 获取数据
exports.distributedData=base.distributedData;
// 多个数据文件
exports.distributedFiles=base.distributedFiles;

// 元数据获取
exports.metaInfo=base.metaInfo;