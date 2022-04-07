/**
 * @function removeMetaData
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const removeMetaData = imageArr => {
  let newImageArr = [];

  for (let index = 0; index < imageArr.length; index++) {
    let fr = new FileReader();
    fr.onload = process;
    fr.mainFile = imageArr[index];
    fr.readAsArrayBuffer(imageArr[index]);
  }

  function process() {
    let dv = new DataView(this.result);
    let offset = 0,
      recess = 0;
    let pieces = [];
    let i = 0;
    if (dv.getUint16(offset) === 0xffd8) {
      offset += 2;
      let app1 = dv.getUint16(offset);
      offset += 2;
      while (offset < dv.byteLength) {
        if (app1 === 0xffe1) {
          pieces[i] = { recess: recess, offset: offset - 2 };
          recess = offset + dv.getUint16(offset);
          i++;
        } else if (app1 === 0xffda) {
          break;
        }
        offset += dv.getUint16(offset);
        app1 = dv.getUint16(offset);
        offset += 2;
      }

      if (pieces.length > 0) {
        let newPieces = [];
        pieces.forEach(function (v) {
          newPieces.push(this.result.slice(v.recess, v.offset));
        }, this);
        newPieces.push(this.result.slice(recess));
        newImageArr.push(
          new Blob(newPieces, { type: imageArr[newImageArr.length].type }),
        );

        if (newImageArr.length === imageArr.length) {
          postMessage(newImageArr);
        }
      } else {
        newImageArr.push(this.mainFile);

        if (newImageArr.length === imageArr.length) {
          postMessage(newImageArr);
        }
      }
    } else {
      newImageArr.push(this.mainFile);

      if (newImageArr.length === imageArr.length) {
        postMessage(newImageArr);
      }
    }
  }
};
