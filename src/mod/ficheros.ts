import { readdir, stat, rm, cp } from "fs";
import { join } from "path";

function ReadDirectory(path: string) : void {
  readdir(path, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach(file => {
        stat(file, (err, stats) => {
          if (err) throw err;
          console.log(file);
          console.log("       size: " + stats.size);
          console.log("   last mod: " + stats.mtime);
        })
      
      });
    }
  });
}

function SafeRemoveFile(path: string, trash: string): void {
  cp(path, trash, (err) => {
    if (err) throw err;
  })
  setTimeout(() => {
    rm(path, (err) => {
      if (err) throw err;
    })
    console.log('Objeto borrado');
  }, 500);
}

function MoveFile(src: string, dst: string) :  void {
  cp(src, dst, (err) => {
    if (err) throw err;
  })
  setTimeout(() => {
    rm(src, (err) => {
      if (err) throw err;
    })
    console.log('Objeto movido');
  }, 500);
}

const testPath : string = "../DSI-template";
const testFile : string = "tsconfig.json";
const testRemove = join(testPath, testFile);
const trashPath : string = "../trash/.";
const testTrash = join(trashPath, testFile);
const testMoveFile : string = "basicFunctions.ts";
const testMove1 : string = join(testPath, 'src',  testMoveFile);
const testMove2 : string = join('../DSI-template/.', testMoveFile);
const testMove3 : string = '../DSI-template/basicFunctions.ts';
const testMove4 : string = join('../DSI-template/src/.', testMoveFile);


ReadDirectory(testPath);
SafeRemoveFile(testRemove, testTrash);
//MoveFile(testMove1, testMove2);
MoveFile(testMove3, testMove4);

