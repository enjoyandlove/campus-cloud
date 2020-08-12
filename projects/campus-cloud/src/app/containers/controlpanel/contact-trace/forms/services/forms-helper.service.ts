import { Injectable } from '@angular/core';
import {
  BlockLogic,
  BlockLogicRowItem,
  BlockType,
  Form,
  FormBlock,
  FormResponse,
  LogicOperator,
  OperandType
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FormsHelperService {
  constructor() {}

  static removeIndexFromBlockLogicList(blockLogicList: BlockLogic[], index: number): BlockLogic[] {
    if (blockLogicList && blockLogicList.length > 0) {
      const skipToSelection: number = blockLogicList[0].next_block_index;

      blockLogicList = blockLogicList.filter(
        (blockLogic) => blockLogic.block_content_index !== index
      );

      blockLogicList.forEach((blockLogic) => {
        if (blockLogic.block_content_index > index) {
          blockLogic.block_content_index = blockLogic.block_content_index - 1;
        }
      });

      if (blockLogicList.length === 0) {
        blockLogicList.push({
          next_block_index: skipToSelection
        });
      }
    }
    return blockLogicList;
  }

  static addContentIndexToBlockLogicRows(blockLogicRows: BlockLogicRowItem[]): void {
    if (blockLogicRows) {
      blockLogicRows.forEach((blockLogicRow) => {
        blockLogicRow.selectionsArray.push(false);
      });
    }
  }

  static removeContentIndexFromBlockLogicRows(
    blockLogicRows: BlockLogicRowItem[],
    index: number
  ): void {
    if (blockLogicRows) {
      blockLogicRows.forEach((blockLogicRow) => {
        blockLogicRow.selectionsArray.splice(index, 1);
      });
    }
  }

  static formatObjectBeforeSave(form: Form): void {
    if (form) {
      if (form.form_block_list) {
        form.form_block_list.forEach((formBlock) => {
          if (!formBlock.extra_info) {
            formBlock.extra_info = '';
          }
          delete formBlock['default_next_block_id'];
          if (formBlock.block_content_list) {
            formBlock.block_content_list.forEach((blockContent) => {
              delete blockContent['form_id'];
              delete blockContent['form_block_id'];
            });
          }

          if (formBlock.blockLogicRows && formBlock.blockLogicRows.length > 0) {
            if (
              formBlock.block_type === BlockType.text ||
              formBlock.block_type === BlockType.number ||
              formBlock.block_type === BlockType.decimal
            ) {
              formBlock.block_logic_list = formBlock.blockLogicRows.map((blockLogicRow) => ({
                logic_op: blockLogicRow.logicOp,
                next_block_index: blockLogicRow.nextBlockIndex,
                arbitrary_data_type: blockLogicRow.arbitraryDataType,
                arbitrary_data: blockLogicRow.arbitraryData
              }));
            } else if (formBlock.block_type === BlockType.image) {
              const blockLogicRow: BlockLogicRowItem = formBlock.blockLogicRows[0];
              formBlock.block_logic_list = [
                {
                  logic_op: blockLogicRow.logicOp,
                  next_block_index: blockLogicRow.nextBlockIndex,
                  block_content_index: 0
                }
              ];
            } else if (
              formBlock.block_type === BlockType.multiple_choice ||
              formBlock.block_type === BlockType.multiple_selection
            ) {
              formBlock.block_logic_list = [];
              formBlock.blockLogicRows.forEach((blockLogicRow) => {
                if (blockLogicRow.selectionsArray) {
                  blockLogicRow.selectionsArray.forEach((selected: boolean, index) => {
                    if (selected) {
                      formBlock.block_logic_list.push({
                        next_block_index: blockLogicRow.nextBlockIndex,
                        logic_op: blockLogicRow.logicOp,
                        block_content_index: index
                      });
                    }
                  });
                }
              });
            }
          } else {
            formBlock.block_logic_list = [];
          }
        });
      }
    }
  }

  static formatFormFromDatabaseForUI(form: Form): void {
    FormsHelperService.convertIdsInFormFromServerToIndexes(form);
    FormsHelperService.prepareResultBlockExternalInfoForUI(form);
    FormsHelperService.prepareBlockLogicDataStructureForUI(form);
  }

  static prepareResultBlockExternalInfoForUI(form: Form): void {
    if (form && form.form_block_list) {
      form.form_block_list.forEach((formBlock) => {
        if (
          formBlock.is_terminal &&
          formBlock.extra_info !== null &&
          formBlock.extra_info !== undefined &&
          formBlock.extra_info.trim().length === 0
        ) {
          // The UI uses this property to determine if logic is enabled or not for the Result block
          // If it is empty string, the UI still considers it as a valid selection.
          // So, we need to set it to null.
          formBlock.extra_info = null;
        }
      });
    }
  }

  static convertIdsInFormFromServerToIndexes(form: Form): void {
    const blockIdToIndexMap: { [key: number]: number } = {};
    const blockIdToContentIdToIndexMap: { [key: number]: { [key: number]: number } } = {};

    if (form) {
      if (form.form_block_list) {
        form.form_block_list.forEach((formBlock, blockIndex) => {
          blockIdToIndexMap[formBlock.id] = blockIndex;
          blockIdToContentIdToIndexMap[formBlock.id] = {};
          if (formBlock.block_content_list) {
            formBlock.block_content_list.forEach((blockContent, contentIndex) => {
              blockIdToContentIdToIndexMap[formBlock.id][blockContent.id] = contentIndex;
            });
          }
        });

        form.form_block_list.forEach((formBlock) => {
          if (formBlock.block_logic_list) {
            formBlock.block_logic_list.forEach((blockLogic) => {
              if (blockLogic.next_block_id !== null && blockLogic.next_block_id !== undefined) {
                blockLogic.next_block_index = blockIdToIndexMap[blockLogic.next_block_id];
              }
              if (
                blockLogic.block_content_id !== null &&
                blockLogic.block_content_id !== undefined
              ) {
                blockLogic.block_content_index =
                  blockIdToContentIdToIndexMap[formBlock.id][blockLogic.block_content_id];
              }
            });
          }
        });
      }
    }
  }

  static prepareBlockLogicDataStructureForUI(form: Form): void {
    if (form && form.form_block_list) {
      form.form_block_list.forEach((formBlock) => {
        if (formBlock.block_logic_list && formBlock.block_logic_list.length > 0) {
          if (
            formBlock.block_type === BlockType.text ||
            formBlock.block_type === BlockType.number ||
            formBlock.block_type === BlockType.decimal
          ) {
            formBlock.blockLogicRows = formBlock.block_logic_list.map((blockLogic) => ({
              logicOp: blockLogic.logic_op,
              arbitraryData: blockLogic.arbitrary_data,
              nextBlockIndex: blockLogic.next_block_index,
              arbitraryDataType: blockLogic.arbitrary_data_type
            }));
          } else if (formBlock.block_type === BlockType.image) {
            const blockLogic: BlockLogic = formBlock.block_logic_list[0];
            formBlock.blockLogicRows = [
              {
                logicOp: blockLogic.logic_op,
                nextBlockIndex: blockLogic.next_block_index,
                selectionsArray: [true]
              }
            ];
          } else if (
            formBlock.block_type === BlockType.multiple_choice ||
            formBlock.block_type === BlockType.multiple_selection
          ) {
            formBlock.blockLogicRows = [];
            let currentBlockLogicRow: BlockLogicRowItem = null;
            formBlock.block_logic_list.forEach((blockLogic) => {
              if (
                !currentBlockLogicRow ||
                currentBlockLogicRow.nextBlockIndex !== blockLogic.next_block_index
              ) {
                currentBlockLogicRow = {
                  nextBlockIndex: blockLogic.next_block_index,
                  logicOp: blockLogic.logic_op,
                  selectionsArray: formBlock.block_content_list.map(() => false)
                };
                formBlock.blockLogicRows.push(currentBlockLogicRow);
              }
              currentBlockLogicRow.selectionsArray[blockLogic.block_content_index] = true;
            });
          }
        }
      });
    }
  }

  static formatFormCreatedFromTemplate(form: Form, template: Form): Form {
    const formNameBackup: string = form.name;
    Object.assign(form, template);
    form.template_form_id = template.id;
    form.name = formNameBackup;
    delete form.id;
    if (form.form_block_list) {
      form.form_block_list.forEach((formBlock) => {
        if (formBlock) {
          delete formBlock.id;
          if (formBlock.block_content_list) {
            formBlock.block_content_list.forEach((blockContent) => {
              if (blockContent) {
                delete blockContent.id;
              }
            });
          }
          if (formBlock.block_logic_list) {
            formBlock.block_logic_list.forEach((blockLogic) => {
              if (blockLogic) {
                delete blockLogic.id;
                delete blockLogic.next_block_id;
                delete blockLogic.block_content_id;
              }
            });
          }
        }
      });
    }
    return form;
  }

  static validateBeforeSave(form: Form, forPublish: boolean): string[] {
    const errorMessages: string[] = [];

    if (form) {
      if (!form.name || form.name.trim().length === 0) {
        errorMessages.push('Form Name');
      }

      if (form.form_block_list) {
        form.form_block_list.forEach((formBlock) => {
          if (formBlock) {
            if (formBlock.block_type === null || formBlock.block_type === undefined) {
              errorMessages.push('Block Type');
            }

            if (FormsHelperService.isNullOrEmptyString(formBlock.text)) {
              errorMessages.push('Block Text');
            }

            if (formBlock.blockLogicRows) {
              formBlock.blockLogicRows.forEach((blockLogicRow) => {
                if (blockLogicRow.nextBlockIndex === -1) {
                  errorMessages.push('Skip To');
                }
              });
            }

            if (
              formBlock.block_type === BlockType.multiple_choice ||
              formBlock.block_type === BlockType.multiple_selection
            ) {
              // Multiple Choice or Multiple Selection
              if (formBlock.block_content_list) {
                formBlock.block_content_list.forEach((blockContent) => {
                  if (blockContent) {
                    if (FormsHelperService.isNullOrEmptyString(blockContent.text)) {
                      errorMessages.push('Content Text');
                    }
                  }
                });
              }
              if (formBlock.blockLogicRows) {
                formBlock.blockLogicRows.forEach((blockLogicRow) => {
                  if (blockLogicRow.selectionsArray.filter((selection) => selection).length === 0) {
                    errorMessages.push('For Selections');
                  }
                });
              }
            }

            if (
              formBlock.block_type === BlockType.text ||
              formBlock.block_type === BlockType.number ||
              formBlock.block_type === BlockType.decimal
            ) {
              // Text, Number or Decimal
              if (formBlock.blockLogicRows) {
                formBlock.blockLogicRows.forEach((blockLogicRow) => {
                  if (
                    !blockLogicRow.arbitraryData ||
                    blockLogicRow.arbitraryData.trim().length === 0
                  ) {
                    errorMessages.push('For Selections');
                  }
                });
              }
            }

            if (formBlock.is_terminal) {
              // Result Block
              if (FormsHelperService.isNullOrEmptyString(formBlock.name)) {
                errorMessages.push('Result Label');
              }
            }
          }
        });
      }

      if (forPublish) {
        const resultBlock: FormBlock = form.form_block_list
          ? form.form_block_list.find((formBlock) => formBlock.is_terminal)
          : null;
        if (!resultBlock) {
          errorMessages.push('Result Block');
        }
      }
    }

    return errorMessages;
  }

  static isNullOrEmptyString(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  static generateRespondentResponsesForQuestion(
    response: FormResponse,
    questionBlock: FormBlock
  ): string[] {
    const userResponses: string[] = [];
    if (questionBlock && response && response.form_block_response_list) {
      if (
        questionBlock.block_type === BlockType.multiple_choice ||
        questionBlock.block_type === BlockType.multiple_selection
      ) {
        if (questionBlock.block_content_list) {
          questionBlock.block_content_list.forEach((content) => {
            response.form_block_response_list.forEach((blockResponse) => {
              if (
                blockResponse.form_block_id === questionBlock.id &&
                blockResponse.response_form_block_content_id === content.id
              ) {
                userResponses.push(content.text);
              }
            });
          });
        }
      } else {
        // Handle text, number and decimal types here
        response.form_block_response_list.forEach((blockResponse) => {
          if (blockResponse.form_block_id === questionBlock.id) {
            userResponses.push(blockResponse.response_data);
          }
        });
      }
    }
    if (userResponses.length === 0) {
      userResponses.push('');
    }
    return userResponses;
  }

  static generateShareUrl(form: Form): string {
    const origin: string = window.origin; // Looks like this: https://campuscloud.readyeducation.com
    return `${origin}/#/cb/web-form/${form.external_id}/start`;
  }

  static generateNewBlockLogicRow(formBlock: FormBlock): BlockLogicRowItem {
    const blockLogicRow: BlockLogicRowItem = {
      nextBlockIndex: -1,
      logicOp: formBlock.block_type === BlockType.image ? LogicOperator.always : LogicOperator.equal
    };

    switch (formBlock.block_type) {
      case BlockType.multiple_choice:
      case BlockType.multiple_selection:
        blockLogicRow.selectionsArray = formBlock.block_content_list.map(() => false);
        break;
      case BlockType.text:
        blockLogicRow.arbitraryDataType = OperandType.str;
        break;
      case BlockType.number:
        blockLogicRow.arbitraryDataType = OperandType.int;
        break;
      case BlockType.decimal:
        blockLogicRow.arbitraryDataType = OperandType.decimal;
        break;
    }

    return blockLogicRow;
  }
}
