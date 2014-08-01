var SegmentProjection = function (trackRender, segment) {
  this.trackRender = trackRender;
  this.segment = segment;
  this.pseudo3d = this.trackRender.raceRender.pseudo3d;
}

SegmentProjection.prototype.project = function (baseSegment, playerZ) {
  var isSegmentLooped = this.segment.index < baseSegment;
  var loopedZ = isSegmentLooped ? this.trackRender.track.length : 0;
  var segmentZ = this.segment.length - playerZ + loopedZ;
  var segmentX = -this.trackRender.player.position.x;
  return this.createProjection(segmentX, segmentZ);
}

SegmentProjection.prototype.createProjection = function (segmentX, segmentZ) {
  var endSegmentZ = segmentZ + this.trackRender.track.segmentLength;
  var startPoint = this.projectPseudo3DPoint(segmentX, 0, segmentZ);
  var endPoint = this.projectPseudo3DPoint(segmentX, 0, endSegmentZ);
  var segmentColorMod = this.segment.index % 2 == 0 ? 0 : 0x080808;
  return {
    color: this.segment.color - segmentColorMod,
    sideColor: this.segment.sideColor + segmentColorMod,
    points: this.createPoints(startPoint, endPoint),
    sidePoints: this.createSidePoints(startPoint, endPoint),
    z: segmentZ
  }
}

SegmentProjection.prototype.projectPseudo3DPoint = function (x, y, z) {
  return this.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

SegmentProjection.prototype.createPoints = function (startPoint, endPoint) {
  var startWidth = (this.segment.width / 2) * startPoint.s;
  var endWidth = (this.segment.width / 2) * endPoint.s;
  return [
    { x: startPoint.x - startWidth, y: startPoint.y },
    { x: startPoint.x + startWidth, y: startPoint.y },
    { x: endPoint.x + endWidth, y: endPoint.y },
    { x: endPoint.x - endWidth, y: endPoint.y }
  ]
}

SegmentProjection.prototype.createSidePoints = function (startPoint, endPoint) {
  var width = this.trackRender.raceRender.config.width;
  return [
    { x: 0, y: startPoint.y },
    { x: width, y: startPoint.y },
    { x: width, y: endPoint.y },
    { x: 0, y: endPoint.y }
  ]
}

module.exports = SegmentProjection;